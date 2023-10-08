import { Form } from "formik";
import { EventId } from "../../constants";
import { AssignClassroomMentor, Mentor } from "../../model";
import { getStatus } from "../../utils";
import { isBefore } from "../../date-func";
import {
  AssignListWrapper,
  ListItemAvatar,
  Typography,
  FormikCheckbox,
  UnAssignListItemControl,
  NoDataPlaceHolder,
  AssignListItemControl,
} from "..";
import { Status } from "../../../components/mentor/constants";

type AssignListProps = {
  handleUnAssign: (value: string) => void;
  setEventId: React.Dispatch<React.SetStateAction<EventId>>;
  eventId: EventId;
  queryString: string;
  prefix: string;
};

type UnassignListProps = {
  handleAssign: (value: string) => void;
  setEventId: React.Dispatch<React.SetStateAction<EventId>>;
  eventId: EventId;
  queryString: string;
  prefix: string;
};

interface AssignMentorList extends AssignListProps {
  records: AssignClassroomMentor[];
}

export const AssignMentorList: React.FC<AssignMentorList> = ({
  records,
  handleUnAssign,
  setEventId,
  eventId,
  queryString,
  prefix,
}) => {
  return (
    <>
      {records && records && records.length > 0 ? (
        records
          .sort((a, b) => (isBefore(a.assignedAt, b.assignedAt) ? 1 : -1))
          .map((item, index) => (
            <AssignListWrapper key={index}>
              <ListItemAvatar
                img={
                  item.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/4128/4128405.png"
                }
              >
                <div className="w-64">
                  <Typography text={item.assignee} type="name" size="normal" />
                  <Typography
                    text={`${item.email} - ${getStatus(item.status || "")}`}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Classroom" type="name" size="small" />
                <Typography text={item.name} type="muted" size="small" />
              </div>
              <Form>
                <FormikCheckbox name="checked" value={item._id}>
                  {""}
                </FormikCheckbox>
              </Form>
              <UnAssignListItemControl
                handleUnAssign={() => handleUnAssign(item._id)}
                setEventId={setEventId}
                name={item.assignee}
              />
            </AssignListWrapper>
          ))
      ) : (
        <NoDataPlaceHolder
          eventId={eventId}
          queryString={queryString}
          prefix={prefix}
        />
      )}
    </>
  );
};

interface UnassignMentorList extends UnassignListProps {
  records: Mentor[];
}

export const UnassignMentorList: React.FC<UnassignMentorList> = ({
  records,
  handleAssign,
  setEventId,
  eventId,
  queryString,
  prefix,
}) => {
  return (
    <>
      {records && records.length > 0 ? (
        records
          .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
          .map((item, index) => (
            <AssignListWrapper key={index}>
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

              {item.status === Status.Active && (
                <>
                  <div className="w-16">
                    <Typography text="Languages" type="name" size="small" />
                    <div className="flex">
                      {item.languages[0] &&
                        item.languages.map((item: string, index: number) => (
                          <span className="mr-1">
                            <Typography
                              key={index}
                              text={`${item}`}
                              type="muted"
                              size="small"
                            />
                          </span>
                        ))}
                    </div>
                  </div>
                  <Form>
                    <FormikCheckbox name="checked" value={item._id}>
                      {""}
                    </FormikCheckbox>
                  </Form>
                  <AssignListItemControl
                    handleAssign={() => handleAssign(item._id)}
                    setEventId={setEventId}
                    name={item.name}
                  />
                </>
              )}
            </AssignListWrapper>
          ))
      ) : (
        <NoDataPlaceHolder
          eventId={eventId}
          queryString={queryString}
          prefix={prefix}
        />
      )}
    </>
  );
};
