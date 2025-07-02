import { CronJob } from "cron";

export default defineNuxtPlugin(() => {
  const fetchApiJob = CronJob.from({
    cronTime: "0 */5 * * * *",
    onTick: function () {
      const { $api } = useNuxtApp();
      $api<JwtLoginResponseDto>("/hello", {
        method: "GET",
      });
    },
    start: true,
  });
});
