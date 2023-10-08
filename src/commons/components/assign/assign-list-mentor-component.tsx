import { capitalize } from "lodash";
import { Form } from "formik";
import { EventId } from "../../constants";
import {
  AssignStudentMentor,
  Student,
  AssignClassroomMentor,
  Classroom,
} from "../../model";
import { getStatus, getGender } from "../../utils";
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

interface AssignStudentList extends AssignListProps {
  records: AssignStudentMentor[];
}

export const AssignStudentList: React.FC<AssignStudentList> = ({
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
              <ListItemAvatar img={item.studentAvatar}>
                <div>
                  <Typography
                    text={item.studentName}
                    type="name"
                    size="normal"
                  />
                  <Typography
                    text={`${item.studentId} - ${getStatus(
                      item.studentStatus
                    )}`}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Mentor" type="name" size="small" />
                <Typography text={item.mentorName} type="muted" size="small" />
              </div>
              <Form>
                <FormikCheckbox name="checked" value={item._id}>
                  {""}
                </FormikCheckbox>
              </Form>
              <UnAssignListItemControl
                handleUnAssign={() => handleUnAssign(item._id)}
                setEventId={setEventId}
                name={item.studentName}
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

interface UnassignStudentList extends UnassignListProps {
  records: Student[];
}

export const UnassignStudentList: React.FC<UnassignStudentList> = ({
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
                <div>
                  <Typography text={item.name} type="name" size="normal" />
                  <Typography
                    text={`${item.studentId} - ${getStatus(item.status)}`}
                    type="muted"
                    size="small"
                  />
                </div>
              </ListItemAvatar>
              <div className="w-16">
                <Typography text="Gender" type="name" size="small" />
                <Typography
                  text={getGender(item.gender)}
                  type="muted"
                  size="small"
                />
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

interface AssignClassroomList extends AssignListProps {
  records: AssignClassroomMentor[];
}

export const AssignClassroomList: React.FC<AssignClassroomList> = ({
  records,
  handleUnAssign,
  setEventId,
  eventId,
  queryString,
  prefix,
}) => {
  return (
    <>
      {records && records.length > 0 ? (
        records
          .sort((a, b) => (isBefore(a.assignedAt, b.assignedAt) ? 1 : -1))
          .map((item, index) => (
            <AssignListWrapper key={index}>
              <div className="w-full flex justify-between">
                <div style={{ flex: "3" }}>
                  <ListItemAvatar img={item.cover}>
                    <Typography text={item.name} type="name" size="normal" />
                    <Typography
                      text={capitalize(item.description || "")}
                      type="muted"
                      size="small"
                    />
                  </ListItemAvatar>
                </div>
                <div style={{ flex: "2" }}>
                  <Typography text="Languages" type="name" size="small" />
                  <div className="flex">
                    {item.languages[0] &&
                      item.languages.map((item: string, index: number) => (
                        <span className="mr-1" key={index}>
                          <Typography
                            text={`${item}`}
                            type="muted"
                            size="small"
                          />
                        </span>
                      ))}
                  </div>
                </div>
                <div style={{ flex: "1" }}>
                  <Form>
                    <FormikCheckbox name="checked" value={item._id}>
                      {""}
                    </FormikCheckbox>
                  </Form>
                </div>
                <UnAssignListItemControl
                  handleUnAssign={() => handleUnAssign(item._id)}
                  setEventId={setEventId}
                  name={item.name}
                />
              </div>
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

interface UnassignClassroomList extends UnassignListProps {
  records: Classroom[];
}

export const UnassignClassroomList: React.FC<UnassignClassroomList> = ({
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
              <div className="w-full flex justify-between">
                <div style={{ flex: "3" }}>
                  <ListItemAvatar img={item.cover}>
                    <Typography text={item.name} type="name" size="normal" />
                    <Typography
                      text={capitalize(item.description || "")}
                      type="muted"
                      size="small"
                    />
                  </ListItemAvatar>
                </div>
                <div style={{ flex: "2" }}>
                  <Typography text="Mentors" type="name" size="small" />
                  <Typography
                    text={`${item.assignedMentor}/25`}
                    type="muted"
                    size="small"
                  />
                </div>
                <div style={{ flex: "1" }}>
                  <Form>
                    <FormikCheckbox name="checked" value={item._id}>
                      {""}
                    </FormikCheckbox>
                  </Form>
                </div>
                <AssignListItemControl
                  handleAssign={() => handleAssign(item._id)}
                  setEventId={setEventId}
                  name={item.name}
                />
              </div>
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
