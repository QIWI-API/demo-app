import React, { Component } from 'react';

import './Header.scss';

export default class Header extends Component {
    render() {

        return (<header className="header">

            <a href="/" className="header__logo">
                <img alt="QIWI" src="https://static.qiwi.com/img/qiwi_com/logo/logo-qiwi-slogan.svg" height="43" />
            </a>

            <ul className="header__menu">
                <li className="header__menu-item">
                    <a href="https://developer.qiwi.com/#products">Документация</a>
                </li>
                <li className="header__menu-item header__menu-item--active">
                    <a href="https://developer.qiwi.com/demo">Демо</a>
                </li>
                <li className="header__menu-item">
                    <a href="https://developer.qiwi.com/#news">Новости</a>
                </li>
                <li className="header__menu-item">
                    <a href="https://developer.qiwi.com/#contacts">Контакты</a>
                </li>
            </ul>

            <div className="header__help">
                <div className="header__help-title">Вопросы</div>
                <a href="mailto:api_help@qiwi.com">api_help@qiwi.com</a>
            </div>

            <ul className="header__lang">
                <li className="header__menu-item">
                    <button type="button" onClick={()=>{
                        this.props.changeLang('en');
                    }} disabled={this.props.lang === 'en'}>EN</button>
                </li>
                <li className="header__menu-item">
                    <button type="button" onClick={()=>{
                        this.props.changeLang('ru');
                    }} disabled={this.props.lang === 'ru'}>RU</button>
                </li>
            </ul>

        </header>)
    }
}