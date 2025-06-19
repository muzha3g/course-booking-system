import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvailableTimeRow } from "./AvailableTimeRow";
import { defaultAvailableTime } from "@/constants/coach";
import { useCoachForm } from "@/hooks/useCoachForm";

interface CoachFormProps {
  form: ReturnType<typeof useCoachForm>["form"];
  fields: any[];
  append: (value: any) => void;
  remove: (index: number) => void;
  watchedAvailableTimes: any[];
  resetValueOnAvailableTime: (index: number) => void;
  isLastRowFilled: () => boolean;
  getOccupiedSlots: (index: number) => Set<string>;
  onSubmit: () => void;
}

export function CoachForm({
  form,
  fields,
  append,
  remove,
  watchedAvailableTimes,
  resetValueOnAvailableTime,
  isLastRowFilled,
  getOccupiedSlots,
  onSubmit,
}: CoachFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" id="coach-info-form">
      <div>
        <Label>Name</Label>
        <Input
          {...form.register("name")}
          className={form.formState.errors.name ? "border-red-500" : ""}
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          {...form.register("description")}
          className={form.formState.errors.description ? "border-red-500" : ""}
        />
        {form.formState.errors.description && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-3 py-1">
        <Label>Available Times</Label>

        {fields.map((field, index) => {
          const occupiedSlots = getOccupiedSlots(index);
          const currentWeekday = watchedAvailableTimes[index]?.weekday;

          return (
            <AvailableTimeRow
              key={field.id}
              control={form.control}
              index={index}
              fieldId={field.id}
              errors={form.formState.errors.availableTimes?.[index]}
              canRemove={fields.length > 1}
              occupiedSlots={occupiedSlots}
              currentWeekday={currentWeekday}
              onRemove={() => remove(index)}
              onReset={() => resetValueOnAvailableTime(index)}
              onWeekdayChange={(val) => {
                form.setValue(`availableTimes.${index}.time`, "");
              }}
            />
          );
        })}

        {form.formState.errors.availableTimes && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.availableTimes.message}
          </p>
        )}

        <div className="my-4">
          {isLastRowFilled() && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => append(defaultAvailableTime)}
              className="rounded-full"
            >
              Add Other Time
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
