import * as React from 'react';
import Navigation from "./Navigation";
import NavigationPartner from './NavigationPartner';
import NavigationEmployee from './NavigationEmployee';
import { NavLink } from 'react-router-dom'
import store from '../redux/store';

const MainListItems = () => {

  const state = store.getState();
  let nav = [];

  if(state && state.user.role !== ''){
    if(state.user.role === 'PARTNER_ROLE'){
      if(state.user.partner === '643cc88d275ca4adfd709dfc'){
        nav = NavigationEmployee;
      }else{
        nav = NavigationPartner;
      }
    }
    if(state.user.role === 'ADMIN_ROLE')
    {
      nav = Navigation;
    }
    if(state.user.role === 'EMPLOYEE_ROLE')
    {
      nav = NavigationEmployee;
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
