import React, { Component } from 'react';
import paymentForMobile from '../../../examples/pull-payments-white-label-example/request.js';

import itemPic from '../../assets/item.png';
import beeIcon from '../../assets/bee.svg';
import megaIcon from '../../assets/mega.svg';
import mtsIcon from '../../assets/mts.svg';
import teleIcon from '../../assets/tele.svg';

import { translate } from 'react-i18next';

import Card from '../../components/Card';
import CheckingOrderView from './views/CheckingOrderView';
import MobileForm from '../../components/MobileForm';
import ConfirmForm from '../../components/ConfirmForm';
import SuccessPage from '../../components/SuccessPage';
import ErrorPage from '../../components/ErrorPage';

@translate()
export default class MobilePayment extends Component {
    constructor(props) {
        super(props);
        const { t } = this.props;
        this.state = {
            currentPaymentMethod: '',
            phone: '',
            numberError: '',
            paymentError: t('error-with-money')
        };

        this.itemCost = 5;
    }

    stateChanger = (state) => {
        return () => this.props.stateChanger(state);
    };

    getPhoneNumber = (phone) => {
        this.setState({
            phone,
            numberError: ''
        });
    };

    makeRequest = () => {
        let url = '/demo/api/paymentForMobile';

        if (__DEV__) {
            url = `http://localhost:5000/${url}`;
        }

        const phone = `+${this.state.phone}`;

        return paymentForMobile(url, phone, this.itemCost).then((response) =>
            response.json()
        );
    };

    toConfirmation = () => {
        const self = this;
        const { t } = this.props;
        const stateChanger = this.stateChanger('confirmation');

        this.makeRequest().then((data) => {
            if (data.response.result_code === 0) {
                stateChanger();
            }
            if (data.response.result_code !== 0) {
                self.setState({
                    numberError: t('numberError')
                });
            }
            if (data.response.result_code === 150) {
                self.setState({
                    numberError: t('error-with-authorization')
                });
            }
            if (data.response.result_code === 300) {
                self.setState({
                    numberError: t('error-with-operator')
                });
            }
        });
    };

    paymentMethod = (currentPaymentMethod) => {
        return () => {
            this.setState({
                currentPaymentMethod
            });
        };
    };

    render() {
        const state = this.props.state;
        const { t } = this.props;
        const {
            currentPaymentMethod,
            phone,
            numberError,
            paymentError
        } = this.state;

        const id = state.id;

        const icons = [beeIcon, megaIcon, mtsIcon, teleIcon];

        const itemCost = this.itemCost;

        const orderInfo = {
            number: '540-201',
            method: 'мобильный баланс',
            sum: itemCost
        };

        const radioButtons = [
            {
                main: t('mobile'),
                disabled: false,
                additional: t('qiwi-commission'),
                handler: this.paymentMethod('mobile'),
                buttonPaymentMethod: "mobile",
                icons
            },
            {
                main: t('non-qiwi'),
                disabled: true,
                additional: t('non-qiwi-commission'),
                handler: this.paymentMethod('other'),
                buttonPaymentMethod: "other",
                icons: []
            }
        ];

        const statesMap = {
            checkingOrder: {
                view: (
                    <CheckingOrderView
                        itemCost={itemCost}
                        itemPic={itemPic}
                        stateChanger={this.stateChanger('paymentByMobile')}
                        id={id}
                        radioButtons={radioButtons}
                        currentPaymentMethod={currentPaymentMethod}
                    />
                )
            },
            paymentByMobile: {
                view: (
                    <MobileForm
                        itemCost={itemCost}
                        stateChanger={this.toConfirmation}
                        getPhoneNumber={this.getPhoneNumber}
                        phone={phone}
                        id={id}
                        icons={icons}
                        numberError={numberError}
                        returning={this.stateChanger('checkingOrder')}
                    />
                )
            },
            confirmation: {
                view: <ConfirmForm stateChanger={this.makeRequest} />
            },
            success: {
                view: (
                    <SuccessPage
                        stateChanger={this.stateChanger('checkingOrder')}
                        itemPic={itemPic}
                        number={orderInfo.number}
                        method={orderInfo.method}
                        sum={orderInfo.sum}
                    />
                )
            }
        };

        return (
            <div>
                <Card title={t('pay-mobile')} id={id}>
                    {statesMap[state.view].view}
                </Card>
            </div>
        );
    }
}
