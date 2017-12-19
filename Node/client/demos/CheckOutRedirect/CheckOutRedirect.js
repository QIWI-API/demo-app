import React, { Component } from 'react';
import paymentByBill from '../../../examples/pull-payments-white-label-example/request.js';

import './CheckOutRedirect.scss';

import itemPic from '../../assets/item.png';
import beeIcon from '../../assets/bee.svg';
import megaIcon from '../../assets/mega.svg';
import mtsIcon from '../../assets/mts.svg';
import teleIcon from '../../assets/tele.svg';

import Card from '../../components/Card';
import CheckingOrderView from './views/CheckingOrderView';
import MobileForm from '../../components/MobileForm';
import SuccessPage from '../../components/SuccessPage';
import ErrorPage from '../../components/ErrorPage';



export default class CheckOutRedirect extends Component {

    constructor(props) {

        super(props);

        this.state = {
            currentPaymentMethod: '',
            phone: '',
            numberError: '',
            paymentError: 'Недостаточно средств на счете.'
        };

        this.itemCost = 1;
    }

    stateChanger = (state) => {
        return () => this.props.stateChanger(state);
    }

    getPhoneNumber = (phone) =>{

        this.setState({
            phone,
            numberError: ''
        });
    }

    makeRequest = () => {

        let url = 'paymentByBill';

        if(__DEV__) {
            url = `http://localhost:5000/${url}`;
        }

        const phone = `+${this.state.phone}`;

        return paymentByBill(url, phone, this.itemCost)
            .then(response => response.json());

    }

    makeRedirect = () => {

        const self = this;

        this.makeRequest().then((data)=>{

            if(data.response.result_code === 0) {

                window.location.href = data.redirect;
            }
            if(data.response.result_code === 150) {

                self.setState({
                    numberError: 'Ошибка авторизации.'
                });
            }
            if(data.response.result_code === 300) {

                self.setState({
                    numberError: 'Ошибка! Ваш оператор не поддерживается.'
                });
            }
            if(data.response.result_code !== 0) {

                self.setState({
                    numberError: 'Произошла ошибка, попробуйте ещё раз.'
                });
            }
        });
    }

    paymentMethod = (currentPaymentMethod) => {

        return () => {
            this.setState({
                currentPaymentMethod
            })
        }
    }


    render() {

        const state = this.props.state;

        const { phone, numberError, paymentError} = this.state;

        const id = state.id;

        const itemCost = this.itemCost;

        const orderInfo = {
            number: '540-201',
            method: 'Qiwi кошелек',
            sum: itemCost
        };

        const statesMap = {
            checkingOrder:{
                view: <CheckingOrderView itemCost={itemCost} itemPic={itemPic} stateChanger={this.stateChanger('paymentByMobile')} id={id} />
            },
            paymentByMobile:{
                view: <MobileForm itemCost={itemCost} stateChanger={this.makeRedirect} getPhoneNumber={this.getPhoneNumber} phone={phone} id={id}numberError={numberError} returning={this.stateChanger('checkingOrder')}/>
            },
            success: {
                view: <SuccessPage stateChanger={this.stateChanger('checkingOrder')} itemPic={itemPic} number={orderInfo.number} method={orderInfo.method} sum={orderInfo.sum}/>
            }
        };

        return (<div>
            <Card title={state.name} id={id}>{statesMap[state.view].view}
            </Card>
        </div>)
    }
}