import { serviceDayService } from "@/services/serviceDayService";
import { settingsService } from "@/services/settingsService";
import { IChurchSettings } from "@/types/settings";
import { IServiceDay } from "@/types/template";
import { useEffect, useState } from "react";

export default function useChurchSettings() {
   const [settings, setSettings] = useState<IChurchSettings | null>(null);

   useEffect(() => {
      async function fetchSettings() {
         try {
            const data = await settingsService.getChurchSettings();
            setSettings(data);
         } catch (error) {
            console.error("Error fetching church settings:", error);
         }
      }
      fetchSettings();
   }, []);

   return settings;
}

export function useServiceDay() {
   const [serviceDays, setServiceDays] = useState<IServiceDay[]>([]);

   useEffect(() => {
      async function fetchServiceDays() {
         try {
            const data = await serviceDayService.list();
            setServiceDays(data);
         } catch (error) {
            console.error("Error fetching church serviceDays:", error);
         }
      }
      fetchServiceDays();
   }, []);

   return serviceDays;
}
