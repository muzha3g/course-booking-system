import { addDays, format } from "date-fns";
import { getCoaches } from "@/app/api/coaches";
import { addCourse, checkCourseExists } from "@/app/api/courses";
import { Coach, Course } from "@/types";

export const generateCourseData = async (days: number = 14) => {
  console.log("開始生成課程數據...");
  try {
    const coaches: Coach[] = await getCoaches();
    if (coaches.length === 0) {
      console.warn("未找到任何教練資料。");
      return;
    }

    const coursesToCreate: Course[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = addDays(today, i);
      const dayIndex = date.getDay(); // 0 (週日) - 6 (週六)

      for (const coach of coaches) {
        for (const { courseType, time, weekday } of coach.availableTimes) {
          if (Number(weekday) === dayIndex) {
            // 確保型別匹配
            const hour = Number(time.slice(0, 2));
            const courseDatetime = new Date(date);
            courseDatetime.setHours(hour, 0, 0, 0); // 設定為課程時間

            // 檢查課程是否已存在
            const exists = await checkCourseExists(coach.id, courseDatetime);
            if (exists) {
              console.log(
                `[SKIP] 已存在課程：${coach.name} - ${courseType} @ ${format(
                  courseDatetime,
                  "yyyy-MM-dd HH:mm"
                )}`
              );
              continue;
            }

            // 使用 Timestamp 儲存 datetime
            const course: Course = {
              id: coach.id + courseDatetime.toISOString(), // 使用時間戳作為 ID 的一部分
              coachId: coach.id,
              coachName: coach.name,
              coachDescription: coach.description,
              courseType,
              date: format(courseDatetime, "yyyy-MM-dd"),
              datetime: courseDatetime.toISOString(),
              reservations: [],
            };
            coursesToCreate.push(course);
          }
        }
      }
    }

    // 批量寫入課程 (如果數量很多，可以考慮批量寫入)
    for (const course of coursesToCreate) {
      await addCourse(course);
    }
    console.log(`生成並添加了 ${coursesToCreate.length} 個新課程。`);
  } catch (error) {
    console.error("生成課程數據時發生錯誤:", error);
  }
};
