"use client";

import React from "react";
import CookieConsent from "react-cookie-consent";
import { toast } from "react-toastify";

const Cookies = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceitar"
      declineButtonText="Rejeitar"
      enableDeclineButton
      cookieName="template"
      style={{ background: "#000000", color: "#FFF" }}
      buttonStyle={{ backgroundColor: "#4CAF50", color: "#FFF", fontSize: "14px" }}
      declineButtonStyle={{ backgroundColor: "#f44336", color: "#FFF", fontSize: "14px" }}
      expires={365}  // Number of days before the cookie expires
      onAccept={() => {
        toast.success("Cookies aceites!");
      }}
      onDecline={() => {
        toast.error("Cookies rejeitados!");
      }}
    >
      Este site utiliza cookies para melhorar a sua experiência. Ao usar o nosso site, você concorda com o uso de cookies. 
      Pode ler mais na nossa política de cookies.
    </CookieConsent>
  );
};

export default Cookies;