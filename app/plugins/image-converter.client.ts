import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import { filetypeinfo } from "magic-bytes.js";
import { fi } from "date-fns/locale";

export default defineNuxtPlugin(() => {
  /**
   * Convertit un blob HEIC en blob PNG si nécessaire, puis compresse en WebP.
   * @param {File} file Le fichier à traiter.
   * @param {number} maxWidth La largeur ou hauteur maximale de l'image.
   * @param {number} [maxSizeMB=0.8] La taille maximale en Mo pour l'image compressée.
   * @returns {Promise<File>} Une promesse qui résout avec le fichier WebP traité.
   */
  const convertToWebp = async (
    file: File,
    maxWidth: number,
    maxSizeMB = 0.8
  ): Promise<File> => {
    let fileToCompress = file;
    const fileType = await detectFileType(fileToCompress);
    if (!fileType) throw new Error("Cannot convert because no file type");
    if (!fileType.ext) throw new Error("Cannot convert because no ext");
    console.log("fileName", fileToCompress.name);
    if (
      !fileToCompress.name
        .toLowerCase()
        .endsWith("." + fileType.ext.toLowerCase())
    ) {
      fileToCompress = matchExtensionWithMagicBytes(
        fileToCompress,
        fileType as { ext: string; mime: string }
      );
    }
    if (fileType?.ext.toLowerCase() === "heic") {
      console.log("HEIC DETECTED");
      try {
        const result = await heic2any({
          blob: fileToCompress,
          toType: "image/png",
        });
        const pngBlob = Array.isArray(result) ? result[0] : result;
        if (!pngBlob) throw new Error("Error while converting from HEIC");
        fileToCompress = new File(
          [pngBlob],
          file.name.replace(/\.heic$/, ".png"),
          {
            type: "image/png",
          }
        );
      } catch (error: any) {
        if (
          error?.code === 1 &&
          error?.message.includes("Image is already browser readable")
        ) {
          console.warn(
            "Le fichier est déjà lisible par le navigateur, conversion ignorée."
          );
        } else {
          throw error; 
        }
      }
    }

    const fileToCompressType = await detectFileType(fileToCompress);

    const compressed = await imageCompression(fileToCompress, {
      maxWidthOrHeight: maxWidth,
      fileType: "image/webp",
      maxSizeMB,
      useWebWorker: true,
    });

    return new File([compressed], file.name.replace(/\.\w+$/, ".webp"), {
      type: "image/webp",
    });
  };
  async function detectFileType(file: File) {
    const buffer = new Uint8Array(await file.arrayBuffer());

    const [info] = filetypeinfo(buffer);

    return info ? { ext: info.extension, mime: info.mime } : null;
  }

  return {
    provide: {
      convertToWebp,
    },
  };
});
function matchExtensionWithMagicBytes(
  file: File,
  fileType: { ext: string; mime: string }
) {
  const splited = file.name.split(".");
  let newExtension = fileType.ext;
  splited[splited.length - 1] = newExtension;
  const recomposedName = splited.join(".");
  file = new File([file], recomposedName, {
    type: fileType.mime,
  });
  return file;
}
