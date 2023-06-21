import { FC } from "react";
import { Mentor } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  ListItemWrapper,
} from "../../commons/components";
import { ListItemControl } from "../../commons/components/list-item";
import { isBefore } from "../../commons/date-func";
import UpdateForm from "./update-form";
import { EventId } from "../../commons/constants";

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
  return (
    <ul className="h-full">
      {mentors &&
        mentors.length > 0 &&
        mentors
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .map((item, index) => (
            <ListItemWrapper
              key={index}
              id={item.id}
              selectedId={selectedId}
              handleSelect={handleSelect}
            >
              <ListItemAvatar img={item.avatar}>
                <div className="w-64">
                  <Typography text={item.name} type="name" size="normal" />
                  <Typography
                    text={`${item.email} - ${item.status}`}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Role" type="name" size="small" />
                <Typography text={item.roles} type="muted" size="small" />
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

export default MentorList;
