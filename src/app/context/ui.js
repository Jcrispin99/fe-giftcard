import React, { createRef, useMemo } from 'react';
import AlertUI from "../../components/shared/AlertUI";
import BlockUI from "../../components/shared/BlockUI";

const UIContext = React.createContext({});
const alertUI = createRef();
const blockUI = createRef();

const UIProvider = props => {

    const rootUI = useMemo(() => {
        return ({
            blockUI,
            alertUI,
        });
    }, []);

    return (
        <UIContext.Provider value={rootUI}>
            {props.children}
            <AlertUI ref={alertUI} />
            <BlockUI ref={blockUI} />
        </UIContext.Provider>
    );
};

const useUI = () => {
    return React.useContext(UIContext);
}

export { UIProvider, useUI };
