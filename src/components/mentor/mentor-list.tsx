import { FC } from "react";
import { Mentor } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  ListItemWrapper,
} from "../../commons/components";
import { ListItemControl } from "../../commons/components/list-item";

type Props = {
  mentors: Mentor[];
  handleUpdate: (value: string) => void;
  handleRemove: (value: string) => void;
};
const MentorList: FC<Props> = ({ mentors, handleUpdate, handleRemove }) => {
  return (
    <ul>
      {mentors &&
        mentors.length > 0 &&
        mentors.map((item) => (
          <ListItemWrapper>
            <ListItemAvatar img={item.avatar}>
              <Typography text={item.name} type="name" size="normal" />
              <Typography
                text={`${item.email} - ${item.status}`}
                type="muted"
                size="small"
              />
            </ListItemAvatar>
            <div className="w-16">
              <Typography text="Role" type="name" size="small" />
              <Typography text={item.roles} type="muted" size="small" />
            </div>
            <ListItemControl
              handleUpdate={handleUpdate}
              handleRemove={handleRemove}
              id={item.id}
              name={item.name}
            >
              <form action=""></form>
            </ListItemControl>
          </ListItemWrapper>
        ))}
    </ul>
  );
};

export default MentorList;
