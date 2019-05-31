import React from "react";
import {
    Datagrid, List, TextField, Show, SimpleShowLayout,
    Filter, TextInput, Create, Edit, SimpleForm, Toolbar,
    SaveButton, EditButton, ReferenceArrayInput,
    SingleFieldList, ChipField, AutocompleteArrayInput, ArrayField
} from 'react-admin';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import {LineBreak} from "../common/components";
import {connect} from 'react-redux';
import LocationUtils from "./LocationUtils";

export const CatchmentCreate = props => (
    <Create {...props}>
        <CatchmentForm/>
    </Create>
);

export const CatchmentEdit = props => (
    <Edit {...props} title={<UserTitle titlePrefix="Edit"/>} undoable={false}>
        <CatchmentForm edit/>
    </Edit>
);

const UserTitle = ({record, titlePrefix}) => {
    return record && <span>{titlePrefix} user <b>{record.username}</b></span>;
};

export const CatchmentDetail = props => {
    return (
        <Show actions={<CustomShowActions/>} {...props}>
            <SimpleShowLayout>
                <TextField label="Catchment" source="name"/>
                <TextField label="Type" source="type"/>
                <ArrayField source="addressLevels">
                    <SingleFieldList>
                        <ChipField source="title"/>
                    </SingleFieldList>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    )
}

const CatchmentFilter = props => (
    <Filter {...props} style={{marginBottom: '2em'}}>
        <TextInput label="Catchment" source="name" resettable alwaysOn/>
        <TextInput label="Type" source="type" resettable alwaysOn/>
    </Filter>
);

export const CatchmentList = props => (
    <List {...props}
          filters={<CatchmentFilter/>}>
        <Datagrid rowClick="show">
            <TextField label="Catchment" source="name"/>
            <TextField label="Type" source="type"/>
        </Datagrid>
    </List>
);

const CustomShowActions = ({basePath, data, resource}) => {
    return (data &&
        <CardActions style={{zIndex: 2, display: 'inline-block', float: 'right'}}>
            <EditButton label="Edit Catchment" basePath={basePath} record={data}/>
        </CardActions>)
        || null
};

const validateCatchment = (values, allLocations) => {
    const errors = {};
    console.log(`validate ${JSON.stringify(values.locationIds)} ${JSON.stringify(allLocations)}`);
    if (!allLocations)
        return errors;
    if (!LocationUtils.areAtTheSameLevel(values.locationIds, allLocations))
        errors.locationIds = ["All locations must be of same level"];
    return errors;
};

const CatchmentFormView = ({edit, ...props}) => {
    const sanitizeProps = ({record, resource, save}) => ({record, resource, save});
    const optionRenderer = choice => `${choice.title} ( ${choice.typeString} )`;
    return (
        <SimpleForm validate={(values) => validateCatchment(values, props.locations)}
                    toolbar={<CustomToolbar/>} {...sanitizeProps(props)} redirect="show">
            <Typography variant="title" component="h3">Catchment</Typography>
            <TextInput source="name" label="Name"/>
            <TextInput source="type" label="Type"/>

            <ReferenceArrayInput
                reference="locations"
                source="locationIds"
                perPage={1000}
                label="Locations"
                filterToQuery={searchText => ({title: searchText})}
            >
                <AutocompleteArrayInput optionText={optionRenderer}/>
            </ReferenceArrayInput>

            <LineBreak num={1}/>
        </SimpleForm>
    );
};
const mapStateToProps = state => ({locations: state.app.locations});
const CatchmentForm = connect(mapStateToProps)(CatchmentFormView);

const CustomToolbar = props =>
    <Toolbar {...props}>
        <SaveButton/>
    </Toolbar>;