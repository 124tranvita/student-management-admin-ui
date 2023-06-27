import { FC } from "react";
import {
  Typography,
  ListItemAvatar,
  ListItemWrapper,
} from "../../commons/components";
import { ListItemControl } from "../../commons/components/list-item";
import { isBefore } from "../../commons/date-func";
import { EventId } from "../../commons/constants";
import { dateFormatter } from "../../commons/time-func";
import UpdateForm from "./update-form";
import { Student } from "../../commons/model";

type Props = {
  students: Student[];
  selectedId: string;
  limit: number;
  handleUpdate: (value: string) => void;
  handleRemove: (value: string) => void;
  handleSelect: (value: string) => void;
  setEventId: (value: EventId) => void;
};
const StudentList: FC<Props> = ({
  students,
  selectedId,
  limit,
  handleUpdate,
  handleRemove,
  handleSelect,
  setEventId,
}) => {
  return (
    <ul className="h-70vh">
      {students &&
        students.length > 0 &&
        students
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .slice(0, limit)
          .map((item, index) => (
            <ListItemWrapper
              key={index}
              id={item.id}
              selectedId={selectedId}
              handleSelect={handleSelect}
            >
              <ListItemAvatar img={item.avatar}>
                <div className="w-48 xl:w-64">
                  <Typography text={item.name} type="name" size="normal" />
                  <Typography
                    text={item.studentId || ""}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Created At" type="name" size="small" />
                <Typography
                  text={dateFormatter(item.createdAt)}
                  type="muted"
                  size="small"
                />
              </div>
              <ListItemControl
                handleUpdate={() => handleUpdate(item.id)}
                handleRemove={() => handleRemove(item.id)}
                setEventId={setEventId}
                name={item.name}
              >
                <UpdateForm />
              </ListItemControl>
            </ListItemWrapper>
          ))}
    </ul>
  );
};

export default StudentList;
