import { FC } from "react";
import { List } from "../../../commons/compound-components";
import { Typography } from "../../../commons/components";
import { AvatarImg } from "../../../commons/components/images";
import { capitalize, getStatus } from "../../../commons/utils";
import { Mentor } from "../../../commons/model";
import UpdateContainer from "../update";
import DeleteContainer from "../delete";

type Props = {
  item: Mentor;
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
  setEventId: (value: string) => void;
};

const ListItem: FC<Props> = ({ item, setMentors, setEventId }) => {
  return (
    <List.Item
      id={item._id}
      renderThumbnail={() => <AvatarImg path={item.avatar} />}
      renderBasicInfo={() => (
        <>
          <div>
            <Typography text={item.name} type="name" size="normal" />
            <Typography
              text={`${item.email} - ${getStatus(item.status)}`}
              type="muted"
              size="small"
            />
          </div>
          <div>
            <Typography text="Role" type="name" size="small" />
            <Typography
              text={capitalize(item.roles)}
              type="muted"
              size="small"
            />
          </div>
        </>
      )}
      renderEditNode={() => (
        <UpdateContainer
          mentor={item}
          setMentors={setMentors}
          setEventId={setEventId}
        />
      )}
      renderDeleteNode={() => (
        <DeleteContainer
          mentorId={item._id}
          setMentors={setMentors}
          setEventId={setEventId}
        />
      )}
    ></List.Item>
  );
};

export default ListItem;
