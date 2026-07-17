import { serviceDayService } from "@/services/serviceDayService";
import { settingsService } from "@/services/settingsService";
import { IChurchSettings } from "@/types/settings";
import { IServiceDay } from "@/types/template";
import { useEffect, useState } from "react";

export default function useChurchSettings() {
   const [settings, setSettings] = useState<IChurchSettings | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      async function fetchSettings() {
         setIsLoading(true);
         try {
            const data = await settingsService.getChurchSettings();
            setSettings(data);
         } catch (error) {
            console.error("Error fetching church settings:", error);
         } finally {
            setIsLoading(false);
         }
      }
      fetchSettings();
   }, []);

   return { settings, isLoading };
}

export function useServiceDay() {
   const [serviceDays, setServiceDays] = useState<IServiceDay[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      async function fetchServiceDays() {
         setIsLoading(true);
         try {
            const data = await serviceDayService.list();
            setServiceDays(data);
         } catch (error) {
            console.error("Error fetching church serviceDays:", error);
         } finally {
            setIsLoading(false);
         }
      }
      fetchServiceDays();
   }, []);

   return { serviceDays, isLoading };
}
