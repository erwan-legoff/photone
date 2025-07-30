import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import { filetypeinfo } from "magic-bytes.js";

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
    const { extension, mime } = (await detectFileType(fileToCompress)) || {};
    if (!extension) throw new Error("Cannot convert because no file type");
    if (!mime) throw new Error("Cannot convert because no extension");
    if (hasWrongExtensionComparedToMagicBytes(fileToCompress, extension)) {
      fileToCompress = matchExtensionWithMagicBytes(
        fileToCompress,
        extension,
        mime
      );
    }
    if (extension === "heic") {
      fileToCompress = await handleHeicConvertion(fileToCompress, file);
    }

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

  return {
    provide: {
      convertToWebp,
    },
  };
});

async function handleHeicConvertion(fileToCompress: File, file: File) {
  try {
    const result = await heic2any({
      blob: fileToCompress,
      toType: "image/png",
    });
    const pngBlob = Array.isArray(result) ? result[0] : result;
    if (!pngBlob) throw new Error("Error while converting from HEIC");
    fileToCompress = new File([pngBlob], file.name.replace(/\.heic$/, ".png"), {
      type: "image/png",
    });
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
  return fileToCompress;
}

function hasWrongExtensionComparedToMagicBytes(
  fileToCompress: File,
  magicBytesExtension: string
) {
  const splited = fileToCompress.name.split(".");
  if (splited.length < 2) return true; // No extension found
  const currentExtension = splited[splited.length - 1]?.toLowerCase();
  if (!currentExtension) return true;
  if (magicBytesExtension === "jpeg") {
    return !["jpg", "jpeg"].includes(currentExtension);
  }
  return currentExtension != magicBytesExtension;
}

async function detectFileType(file: File) {
  const buffer = new Uint8Array(await file.arrayBuffer());

  const [info] = filetypeinfo(buffer);

  return info
    ? {
        extension: info.extension?.toLowerCase(),
        mime: info.mime?.toLowerCase(),
      }
    : null;
}

function matchExtensionWithMagicBytes(
  file: File,
  extension: string,
  mime: string
) {
  const splited = file.name.split(".");
  let newExtension = extension;
  splited[splited.length - 1] = newExtension;
  const recomposedName = splited.join(".");
  file = new File([file], recomposedName, {
    type: mime,
  });
  return file;
}
