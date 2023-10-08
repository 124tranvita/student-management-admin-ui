import { FC } from "react";
import { Classroom } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  ListItemWrapper,
  ListEmpty,
} from "../../commons/components";
import { ListItemControl } from "../../commons/components/list-item";
import { isBefore } from "../../commons/date-func";
import { EventId } from "../../commons/constants";
import { dateFormatter } from "../../commons/time-func";
import UpdateForm from "./update-form";

type Props = {
  classrooms: Classroom[];
  selectedId: string;
  limit: number;
  handleUpdate: (value: string) => void;
  handleRemove: (value: string) => void;
  handleSelect: (value: string) => void;
  setEventId: (value: EventId) => void;
};
const ClassroomList: FC<Props> = ({
  classrooms,
  selectedId,
  limit,
  handleUpdate,
  handleRemove,
  handleSelect,
  setEventId,
}) => {
  if (classrooms && classrooms.length === 0) {
    return (
      <>
        <ListEmpty />
      </>
    );
  }
  return (
    <ul className="h-70vh">
      {classrooms &&
        classrooms.length > 0 &&
        classrooms
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .slice(0, limit)
          .map((item, index) => (
            <ListItemWrapper
              key={index}
              id={item._id}
              selectedId={selectedId}
              handleSelect={handleSelect}
            >
              <ListItemAvatar img={item.cover}>
                <div className="w-48 xl:w-72">
                  <Typography text={item.name} type="name" size="normal" />
                  <Typography
                    text={item.description || ""}
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
                handleUpdate={() => handleUpdate(item._id)}
                handleRemove={() => handleRemove(item._id)}
                setEventId={setEventId}
                name={item.name}
                disabled={item.assignedMentor > 0 || item.assignedStudent > 0}
              >
                <UpdateForm />
              </ListItemControl>
            </ListItemWrapper>
          ))}
    </ul>
  );
};

export default ClassroomList;
