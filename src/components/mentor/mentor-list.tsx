import { FC } from "react";
import { Mentor } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  ListItemWrapper,
  ListEmpty,
} from "../../commons/components";
import { ListItemControl } from "../../commons/components/list-item";
import { isBefore } from "../../commons/date-func";
import { EventId } from "../../commons/constants";
import { capitalize, getStatus } from "../../commons/utils";
import UpdateForm from "./update-form";

type Props = {
  mentors: Mentor[];
  selectedId: string;
  handleUpdate: (value: string) => void;
  handleRemove: (value: string) => void;
  handleSelect: (value: string) => void;
  setEventId: (value: EventId) => void;
};
const MentorList: FC<Props> = ({
  mentors,
  selectedId,
  handleUpdate,
  handleRemove,
  handleSelect,
  setEventId,
}) => {
  if (mentors && mentors.length === 0) {
    return (
      <>
        <ListEmpty />
      </>
    );
  }
  return (
    <ul style={{ height: "75vh" }}>
      {mentors &&
        mentors.length > 0 &&
        mentors
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .map((item, index) => (
            <ListItemWrapper
              key={index}
              id={item._id}
              selectedId={selectedId}
              handleSelect={handleSelect}
            >
              <ListItemAvatar img={item.avatar}>
                <div className="w-64">
                  <Typography text={item.name} type="name" size="normal" />
                  <Typography
                    text={`${item.email} - ${getStatus(item.status)}`}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Role" type="name" size="small" />
                <Typography
                  text={capitalize(item.roles)}
                  type="muted"
                  size="small"
                />
              </div>
              <ListItemControl
                handleUpdate={() => handleUpdate(item._id)}
                handleRemove={() => handleRemove(item._id)}
                setEventId={setEventId}
                name={item.name}
                disabled={
                  item.assignedClassroom > 0 || item.assignedStudent > 0
                }
              >
                <UpdateForm />
              </ListItemControl>
            </ListItemWrapper>
          ))}
    </ul>
  );
};

export default MentorList;
