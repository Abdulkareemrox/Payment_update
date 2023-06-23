import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './PaymentForm.css';
import Visa from './Images/Visa.png';
import MasterCard from './Images/Mastercard.jpg';

const PaymentForm = () => {
  const initialValues = {
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    cardType: '',
  };

  const validationSchema = Yup.object({
    cardNumber: Yup.string()
      .required('Card number is required'),
    cardName: Yup.string().required('Card name is required').matches(/^[A-Za-z ]*$/, 'Please enter valid name')
    .max(40),
    expiry: Yup.string()
      .required('Expiry date is required')
      .matches(/^\d{2}\/\d{2}$/, 'Invalid expiry date')
      .test(
        'validDate',
        'Card expiry date must be a future date',
        (value) => {
          if (!value) return false;

          const today = new Date();
          const currentYear = today.getFullYear() % 100;
          const currentMonth = today.getMonth() + 1;
          const month = parseInt(value.slice(0, 2), 10);
          const year = parseInt(value.slice(3), 10);
          const normalizedYear = year >= 100 ? year : currentYear + year;

          return (
            (normalizedYear > currentYear || (normalizedYear === currentYear && month >= currentMonth)) &&
            month <= 12
          );
        }
      ),
    cvv: Yup.string()
      .required('CVV is required')
      .matches(/^\d{3}$/, 'Invalid CVV'),
  });

  const handleSubmit = (values) => {
    console.log(values);
    // Perform your form submission logic here
  };

  const handleCardNumberChange = (event, setFieldValue) => {
    const { value } = event.target;
    const cardNumber = value.replace(/[^0-9]/g, '').slice(0, 16);

    const formattedCardNumber = cardNumber
      .split('')
      .reduce((result, digit, index) => {
        if (index > 0 && index % 4 === 0) {
          return `${result}-${digit}`;
        }
        return `${result}${digit}`;
      }, '');

    setFieldValue('cardNumber', formattedCardNumber);

    // Determine the card type based on the first 4 digits
    const cardType = getCardType(cardNumber.slice(0, 4));
    setFieldValue('cardType', cardType);
  };

  const handleExpiryChange = (event, setFieldValue) => {
    const { value } = event.target;
    const formattedExpiry = value.replace(/[^0-9]/g, '').slice(0, 4);

    if (formattedExpiry.length >= 2) {
      const month = formattedExpiry.slice(0, 2);
      const year = formattedExpiry.slice(2);
      setFieldValue('expiry', `${month}/${year}`);
    } else {
      setFieldValue('expiry', formattedExpiry);
    }
  };

  const getCardType = (firstFourDigits) => {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;

    if (visaRegex.test(firstFourDigits)) {
      return 'visa';
    } else if (mastercardRegex.test(firstFourDigits)) {
      return 'mastercard';
    }

    return '';
  };

  return (
    <div className="container">
      <h2>Payment Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <div className="input-container">
              <label htmlFor="cardNumber">Card Number</label>
              {values.cardType === 'visa' && (
                <img src={Visa} alt="Visa Logo" className="card-logo" />
              )}
              {values.cardType === 'mastercard' && (
                <img src={MasterCard} alt="Mastercard Logo" className="card-logo" />
              )}
              <Field
                type="text"
                name="cardNumber"
                className={`logo ${errors.cardNumber && touched.cardNumber ? 'error' : ''}`}
                onChange={(event) => handleCardNumberChange(event, setFieldValue)}
              />
              {errors.cardNumber && touched.cardNumber && (
                <div className="error-message">{errors.cardNumber}</div>
              )}
            </div>

            <div className="input-container">
              <label htmlFor="cardName">Card Name</label>
              <Field
                type="text"
                name="cardName"
                className={errors.cardName && touched.cardName ? 'error' : ''}
              />
              {errors.cardName && touched.cardName && (
                <div className="error-message">{errors.cardName}</div>
              )}
            </div>

            <div className="input-container">
              <label htmlFor="expiry">Expiry</label>
              <Field
                type="text"
                name="expiry"
                className={errors.expiry && touched.expiry ? 'error' : ''}
                maxLength={5}
                onChange={(event) => handleExpiryChange(event, setFieldValue)}
              />
              {errors.expiry && touched.expiry && (
                <div className="error-message">{errors.expiry}</div>
              )}
            </div>

            <div className="input-container">
              <label htmlFor="cvv">CVV</label>
              <Field
                type="password"
                name="cvv"
                className={errors.cvv && touched.cvv ? 'error' : ''}
                maxLength={3}
              />
              {errors.cvv && touched.cvv && (
                <div className="error-message">{errors.cvv}</div>
              )}
            </div>

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PaymentForm;
