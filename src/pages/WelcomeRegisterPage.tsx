import React from 'react';
import { CustomerProfilePage } from './CustomerProfilePage';

/**
 * WelcomeRegisterPage - Legacy welcome banner and Facebook synchronization
 * have been completely removed per requirements in favor of a clean, seamless
 * one-click guest login flow and direct CustomerProfilePage editing.
 */
export const WelcomeRegisterPage: React.FC = () => {
  return <CustomerProfilePage />;
};

export default WelcomeRegisterPage;
