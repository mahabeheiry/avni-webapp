import React from "react";
import { DashboardReducer } from "./DashboardReducer";
import http from "../../../common/utils/httpClient";
import { find, get, isEmpty, isNil } from "lodash";
import FormLabel from "@material-ui/core/FormLabel";
import { DocumentationContainer } from "../../../common/components/DocumentationContainer";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { AvniTextField } from "../../../common/components/AvniTextField";
import { AvniFormLabel } from "../../../common/components/AvniFormLabel";
import { SaveComponent } from "../../../common/components/SaveComponent";
import Box from "@material-ui/core/Box";
import { Title } from "react-admin";
import DeleteIcon from "@material-ui/icons/Delete";
import { Redirect } from "react-router-dom";
import DraggableDashboardCards from "./DraggableDashboardCards";
import { SelectCardsView } from "./SelectCardsView";

const initialState = { name: "", description: "", cards: [] };
export const CreateEditDashboard = ({ edit, history, ...props }) => {
  const [dashboard, dispatch] = React.useReducer(DashboardReducer, initialState);
  const [error, setError] = React.useState([]);
  const [id, setId] = React.useState();
  const [redirectAfterDelete, setRedirectAfterDelete] = React.useState(false);
  React.useEffect(() => {
    if (edit) {
      http
        .get(`/web/dashboard/${props.match.params.id}`)
        .then(res => res.data)
        .then(res => {
          dispatch({ type: "setData", payload: res });
        });
    }
  }, []);

  const validateRequest = () => {
    const { name, cards } = dashboard;
    if (isEmpty(name) && isEmpty(cards)) {
      setError([
        { key: "EMPTY_NAME", message: "Name cannot be empty" },
        { key: "EMPTY_CARDS", message: "Cards cannot be empty" }
      ]);
    } else if (isEmpty(name)) {
      setError([...error, { key: "EMPTY_NAME", message: "Name cannot be empty" }]);
    } else if (isEmpty(cards)) {
      setError([...error, { key: "EMPTY_CARDS", message: "Cards cannot be empty" }]);
    }
  };

  const onSave = () => {
    validateRequest();
    if (!isEmpty(dashboard.name) && !isEmpty(dashboard.cards)) {
      const url = edit ? `/web/dashboard/${props.match.params.id}` : "/web/dashboard";
      const methodName = edit ? "put" : "post";
      http[methodName](url, dashboard)
        .then(res => {
          if (res.status === 200) {
            setId(res.data.id);
          }
        })
        .catch(error => {
          setError([
            {
              key: "SERVER_ERROR",
              message: `${get(error, "response.data") ||
                get(error, "message") ||
                "error while saving dashboard"}`
            }
          ]);
        });
    }
  };

  const onDelete = () => {
    if (window.confirm("Do you really want to delete dashboard record?")) {
      http
        .delete(`/web/dashboard/${props.match.params.id}`)
        .then(response => {
          if (response.status === 200) {
            setRedirectAfterDelete(true);
          }
        })
        .catch(error => console.error(error));
    }
  };

  const onChange = (type, event, errorKey) => {
    setError(error.filter(({ key }) => key !== errorKey));
    dispatch({ type: type, payload: event.target.value });
  };

  const getErrorByKey = errorKey => {
    const errorByKey = find(error, ({ key }) => key === errorKey);
    return isEmpty(errorByKey) ? null : (
      <FormLabel error style={{ fontSize: "12px" }}>
        {errorByKey.message}
      </FormLabel>
    );
  };

  return (
    <Box boxShadow={2} p={3} bgcolor="background.paper">
      <Title title={"Create Offline Dashboard"} />
      <DocumentationContainer filename={"Dashboard.md"}>
        {edit && (
          <Grid container style={{ justifyContent: "flex-end" }}>
            <Button color="primary" type="button" onClick={() => setId(props.match.params.id)}>
              <VisibilityIcon /> Show
            </Button>
          </Grid>
        )}
        <AvniTextField
          multiline
          id="name"
          label="Name*"
          autoComplete="off"
          value={dashboard.name}
          onChange={event => onChange("name", event, "EMPTY_NAME")}
          toolTipKey={"APP_DESIGNER_DASHBOARD_NAME"}
        />
        {getErrorByKey("EMPTY_NAME")}
        <p />
        <AvniTextField
          multiline
          id="description"
          label="Description"
          autoComplete="off"
          value={dashboard.description}
          onChange={event => dispatch({ type: "description", payload: event.target.value })}
          toolTipKey={"APP_DESIGNER_DASHBOARD_DESCRIPTION"}
        />
        <p />
        <AvniFormLabel label={"Cards"} toolTipKey={"APP_DESIGNER_DASHBOARD_CARDS"} />
        <Grid container>
          <Grid item xs={10}>
            <SelectCardsView dashboardCards={dashboard.cards} dispatch={dispatch} />
            <DraggableDashboardCards
              cards={dashboard.cards}
              dispatch={dispatch}
              history={history}
            />
          </Grid>
        </Grid>
        {getErrorByKey("EMPTY_CARDS")}
        <p />
        {getErrorByKey("SERVER_ERROR")}
        <Grid container direction={"row"}>
          <Grid item xs={1}>
            <SaveComponent name="save" onSubmit={onSave} />
          </Grid>
          <Grid item xs={11}>
            {edit && (
              <Button style={{ float: "right", color: "red" }} onClick={onDelete}>
                <DeleteIcon /> Delete
              </Button>
            )}
          </Grid>
        </Grid>
        {!isNil(id) && <Redirect to={`/appDesigner/dashboard/${id}/show`} />}
        {redirectAfterDelete && <Redirect to="/appDesigner/dashboard" />}
      </DocumentationContainer>
    </Box>
  );
};
