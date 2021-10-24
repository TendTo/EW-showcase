import { AppContext } from '../../context/appContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import VoltaApi, { getAccountInfoResponse } from '../../api/VoltaApi';
import EwAccount from '../EwAccount/EwAccount';
import './ENS.css';

type FormInput = {
  search: string;
}

function ENS() {
  const { signer } = useContext(AppContext).state;
  const voltaApi = useRef(new VoltaApi());
  const account = useRef<getAccountInfoResponse>();
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, handleSubmit, reset } = useForm<FormInput>();
  const { t } = useTranslation();

  const isName = (name: string) => name.endsWith(".ewc");
  const isAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);

  const onSubmit = async ({ search }: FormInput) => {
    if (loading)
      return;
    reset();
    setLoading(true);
    let newAddress = "";
    if (isName(search)) { // ENS resolve
      try {
        newAddress = await signer.provider!.resolveName(search) || "";
      } catch (err: any) {
        console.error(err);
        setError(t("ERROR.GENERIC"));
        if (err.message.startsWith("The resolver at 0x0000000000000000000000000000000000000000"))
          setError(t("ERROR.ADDRESS_NOT_FOUND"));
      }
    } else if (isAddress(search)) { // Explicit address
      newAddress = search;
    } else { // Invalid address
      setError(t("ERROR.INVALID_INPUT"));
      setLoading(false);
    }
    if (!newAddress || newAddress === address)
      setLoading(false);
    setAddress(newAddress);
  }

  const getAccountComponent = (address: string) => {
    if (address === "" || account.current === undefined)
      return null;
    return <EwAccount account={account.current} address={address}></EwAccount>
  }

  useEffect(() => {
    if (address) {
      voltaApi.current.getAccountInfo(address)
        .then(accountInfo => {
          account.current = accountInfo;
          setLoading(false);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [address]);

  return (
    <div className="app-page">
      <div className="app-page-header mb-3">
        <h2>{t('ENS.TITLE')}</h2>
      </div>
      <h3>{t("ENS.SECTION_1_TITLE")}</h3>
      <p>{t('ENS.SECTION_1_TEXT')}</p>
      <h3>{t("ENS.SECTION_2_TITLE")}</h3>
      <p>{t('ENS.SECTION_2_TEXT')}</p>
      <ol>
        <li><Trans i18nKey="ENS.SECTION_2_ITEM_1" components={{ a: <a href="https://docs.ens.domains/contract-api-reference/name-processing" target="_blank" rel="noreferrer">a</a> }} /></li>
        <li>{t("ENS.SECTION_2_ITEM_2")}</li>
        <li>{t("ENS.SECTION_2_ITEM_3")}</li>
      </ol>
      <p><Trans i18nKey="ENS.SECTION_2_TEXT_PT_2" components={{ a: <a href="https://energyweb.atlassian.net/wiki/spaces/EWF/pages/555745281/Using+ENS" target="_blank" rel="noreferrer">a</a> }} /></p>
      <h3>{t("ENS.SECTION_3_TITLE")}</h3>
      <p>{t('ENS.SECTION_3_TEXT')}</p>
      <Form className="form-h" onSubmit={handleSubmit(onSubmit)}>
        <InputGroup hasValidation className="align-items-baseline">
          <InputGroup.Text>{t('ENS.SECTION_3_LABEL_1')} </InputGroup.Text>
          <div className="d-flex-v ens-searchbar">
            <FormControl
              {...register('search', {
                required: { value: true, message: t("ERROR.EMPTY_FIELD") },
                validate: (val: string) => isName(val) || isAddress(val) ? true : (t("ERROR.INVALID_INPUT") as string)
              })}
              type="search"
              placeholder={t('ENS.SEARCH')}
              isInvalid={errors.search?.type === "required" || errors.search?.type === "validate"}
              aria-label={t('ENS.SEARCH')}
            />
            <Form.Control.Feedback type="invalid">
              {errors.search?.message}
            </Form.Control.Feedback>
          </div>
          <Button variant="outline-success" type="submit" disabled={loading}>
            <i className="fa fa-search"></i>
          </Button>
        </InputGroup>
      </Form>
      <br></br>
      {!loading && !getAccountComponent(address) && <div className="app-space"><p className="text-danger">{error}</p></div>}
      {loading && <div className="app-space"><Spinner animation="border"></Spinner></div>}
      {!loading && getAccountComponent(address)}
    </div >
  );
}

export default ENS;
