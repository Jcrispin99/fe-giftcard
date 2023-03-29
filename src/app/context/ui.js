import React, { createRef, useMemo, createContext } from 'react';
import AlertUI from "../../components/shared/AlertUI";
import SnackbarUI from '../../components/shared/SnackbarUI';
import BlockUI from "../../components/shared/BlockUI";
import DialogUI from '../../components/shared/DialogUI';

const UIContext = createContext({});
const alertUI = createRef();
const blockUI = createRef();
const dialogUI = createRef();
const snackbarUI = createRef();

const UIProvider = props => {

    const rootUI = useMemo(() => {
        return ({
            blockUI,
            snackbarUI,
            alertUI,
            dialogUI,
        });
    }, []);

    return (
        <UIContext.Provider value={rootUI}>
            {props.children}
            <AlertUI ref={alertUI} />
            <SnackbarUI ref={snackbarUI} />
            <BlockUI ref={blockUI} />
            <DialogUI ref={dialogUI} />
        </UIContext.Provider>
    );
};

const useUI = () => {
    return React.useContext(UIContext);
}

export { UIProvider, useUI };
