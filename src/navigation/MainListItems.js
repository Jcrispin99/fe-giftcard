import * as React from 'react';
import Navigation from "./Navigation";
import NavigationPartner from './NavigationPartner';
import NavigationPublic from './NavigationPublic';
import { NavLink } from 'react-router-dom'
import store from '../redux/store';

const MainListItems = (props) => {

  const state = store.getState();
  let nav = [];
  if(state && state.user.role !== ''){
    console.log('state.user.role',state.user.role);
    if(state.user.role === 'PARTNER_ROLE'){
      nav = NavigationPartner;
    }
    if(state.user.role === 'ADMIN_ROLE' || 
       state.user.role === 'EMPLOYEE_ROLE')
    {
      nav = Navigation;
    }
  }

  return (
    <div>
      <nav>
        <ul>
          {nav.map((nav, i) => {
            return (
              <ChildrenItems key={i} menu={nav} />
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

const ChildrenItems = props => {
  const { menu } = props; 
  return (
    <NavLink exact={true} className='liNavLink' activeStyle={{borderBottom: '4px solid #80BB57', color: '#80BB57', fontWeight: 'bold'}} to={menu.url}>{menu.title}</NavLink>
  )
}

export { MainListItems };
