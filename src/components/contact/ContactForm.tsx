"use client";

import { useEffect, useRef, type ChangeEvent } from "react";
import { Send } from "lucide-react";
import {
  useContactForm,
  type ContactChannelStatus,
} from "@/components/contact/useContactForm";
import { contactInputLimits, type ContactField } from "@/lib/contact/contracts";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  onChannelStatusChange?: (status: ContactChannelStatus) => void;
  variant: "desktop" | "mobile";
};

export function ContactForm({
  onChannelStatusChange,
  variant,
}: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { channelStatus, fieldErrors, handleSubmit, setField, status, values } =
    useContactForm();
  const isSubmitting = status.type === "submitting";
  const isDisabled = isSubmitting || channelStatus.state !== "available";
  const idPrefix = `contact-${variant}`;

  useEffect(() => {
    onChannelStatusChange?.(channelStatus);
  }, [channelStatus, onChannelStatusChange]);

  useEffect(() => {
    if (status.type !== "error" || !Object.keys(fieldErrors).length) return;

    formRef.current
      ?.querySelector<HTMLElement>("[aria-invalid='true']")
      ?.focus();
  }, [fieldErrors, status.type]);

  const fieldProps = (field: ContactField) => {
    const errorId = `${idPrefix}-${field}-error`;
    const hasError = Boolean(fieldErrors[field]);

    return {
      "aria-describedby": hasError ? errorId : undefined,
      "aria-invalid": hasError,
      id: `${idPrefix}-${field}`,
      name: field,
      disabled: isDisabled,
      value: values[field],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setField(field, event.target.value),
    };
  };

  const renderError = (field: ContactField) =>
    fieldErrors[field] ? (
      <small className="contact-form__error" id={`${idPrefix}-${field}-error`}>
        {fieldErrors[field]}
      </small>
    ) : null;
  const visibleStatus =
    status.type !== "idle"
      ? status
      : onChannelStatusChange
        ? null
        : channelStatus.state === "checking"
          ? { type: "submitting" as const, message: channelStatus.message }
          : channelStatus.state === "unavailable"
            ? { type: "error" as const, message: channelStatus.message }
            : null;

  return (
    <form
      aria-busy={isSubmitting || channelStatus.state === "checking"}
      className={cn("contact-form", `contact-form--${variant}`)}
      noValidate
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <div className="contact-form__fields">
        <div className="contact-form__field contact-form__field--name">
          <label htmlFor={`${idPrefix}-name`}>Seu nome</label>
          <input
            {...fieldProps("name")}
            autoComplete="name"
            maxLength={contactInputLimits.name}
            placeholder="Digite seu nome"
            required
            type="text"
          />
          {renderError("name")}
        </div>

        <div className="contact-form__field contact-form__field--email">
          <label htmlFor={`${idPrefix}-email`}>Seu e-mail</label>
          <input
            {...fieldProps("email")}
            autoComplete="email"
            inputMode="email"
            maxLength={contactInputLimits.email}
            placeholder="seuemail@exemplo.com"
            required
            type="email"
          />
          {renderError("email")}
        </div>

        <div className="contact-form__field contact-form__field--subject contact-form__field--wide">
          <label htmlFor={`${idPrefix}-subject`}>Assunto</label>
          <input
            {...fieldProps("subject")}
            autoComplete="off"
            maxLength={contactInputLimits.subject}
            placeholder="Sobre o que vamos conversar?"
            required
            type="text"
          />
          {renderError("subject")}
        </div>

        <div className="contact-form__field contact-form__field--message contact-form__field--wide">
          <label htmlFor={`${idPrefix}-message`}>Mensagem</label>
          <textarea
            {...fieldProps("message")}
            maxLength={contactInputLimits.message}
            placeholder="Conte brevemente sobre a oportunidade ou projeto."
            required
            rows={variant === "desktop" ? 2 : 4}
          />
          <span className="contact-form__message-meta">
            {renderError("message")}
            <small>
              {values.message.length}/{contactInputLimits.message}
            </small>
          </span>
        </div>
      </div>

      <div className="contact-form__actions">
        <p>Seu e-mail será usado somente para responder esta mensagem.</p>
        <button disabled={isDisabled} type="submit">
          <Send aria-hidden="true" size={16} />
          {isSubmitting
            ? "Enviando..."
            : channelStatus.state === "unavailable"
              ? "Indisponível"
              : "Enviar mensagem"}
        </button>
      </div>

      {visibleStatus ? (
        <p
          className={cn("contact-form__status", `is-${visibleStatus.type}`)}
          role={visibleStatus.type === "error" ? "alert" : "status"}
        >
          {visibleStatus.message}
        </p>
      ) : null}
    </form>
  );
}
