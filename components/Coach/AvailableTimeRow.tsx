import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoTrashOutline } from "react-icons/io5";
import { times, weekdays, courseTypes } from "@/constants/coach";

interface AvailableTimeRowProps {
  control: any;
  index: number;
  fieldId: string;
  errors: any;
  canRemove: boolean;
  occupiedSlots: Set<string>;
  currentWeekday?: string;
  onRemove: () => void;
  onReset: () => void;
  onWeekdayChange: (value: string) => void;
}

export function AvailableTimeRow({
  control,
  index,
  fieldId,
  errors,
  canRemove,
  occupiedSlots,
  currentWeekday,
  onRemove,
  onReset,
  onWeekdayChange,
}: AvailableTimeRowProps) {
  return (
    <div key={fieldId} className="flex items-start gap-2">
      <div>
        <Controller
          control={control}
          name={`availableTimes.${index}.courseType`}
          render={({ field: selectField }) => (
            <Select
              onValueChange={selectField.onChange}
              value={selectField.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Course Type" />
              </SelectTrigger>
              <SelectContent>
                {courseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors?.courseType && (
          <p className="text-red-500 text-sm">{errors.courseType.message}</p>
        )}
      </div>

      <div>
        <Controller
          control={control}
          name={`availableTimes.${index}.weekday`}
          render={({ field: selectField }) => (
            <Select
              value={selectField.value}
              onValueChange={(val) => {
                selectField.onChange(val);
                onWeekdayChange(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Weekday" />
              </SelectTrigger>
              <SelectContent>
                {weekdays.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors?.weekday && (
          <p className="text-red-500 text-sm">{errors.weekday.message}</p>
        )}
      </div>

      <div>
        <Controller
          control={control}
          name={`availableTimes.${index}.time`}
          render={({ field: selectField }) => (
            <Select
              onValueChange={selectField.onChange}
              value={selectField.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {times.map((t) => (
                  <SelectItem
                    key={t.label}
                    value={t.value}
                    disabled={
                      !!(
                        currentWeekday &&
                        occupiedSlots.has(`${currentWeekday}-${t.value}`)
                      )
                    }
                  >
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors?.time && (
          <p className="text-red-500 text-sm">{errors.time.message}</p>
        )}
      </div>

      {canRemove ? (
        <Button
          className="round"
          type="button"
          variant="secondary"
          onClick={onRemove}
        >
          <IoTrashOutline />
        </Button>
      ) : (
        <Button
          className="round"
          type="button"
          variant="secondary"
          onClick={onReset}
        >
          -
        </Button>
      )}
    </div>
  );
}
