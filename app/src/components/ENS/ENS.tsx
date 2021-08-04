import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Web3 from 'web3';
import VoltaApi, { getAccountInfoResponse } from '../../api/VoltaApi';
import EwAccount from '../EwAccount/EwAccount';
import { title, genericError, notFoundError, unrecognizedError, emptyError } from './ENS.json';

type Props = {
  web3?: Web3;
};

type FormInput = {
  search: string;
}

function ENS({ web3 }: Props) {
  const voltaApi = useRef(new VoltaApi());
  const account = useRef<getAccountInfoResponse>();
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, handleSubmit, reset } = useForm<FormInput>();

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
        newAddress = await web3?.eth.ens.getAddress(search) || "";
      } catch (err) {
        console.error(err);
        setError(genericError);
        if (err.message.startsWith("The resolver at 0x0000000000000000000000000000000000000000"))
          setError(notFoundError);
      }
    } else if (isAddress(search)) { // Explicit address
      newAddress = search;
    } else { // Invalid address
      setError(unrecognizedError);
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
        }).catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [address]);


  return (
    <Card>
      <Card.Body>
        <Card.Title>ENS service</Card.Title>
        <div>
          <Card.Text>
            {title}
          </Card.Text>
          <Form className="form-h" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup hasValidation>
              <InputGroup.Text>Name or address: </InputGroup.Text>
              <FormControl
                {...register('search', {
                  required: { value: true, message: emptyError },
                  validate: (val: string) => isName(val) || isAddress(val) ? true : unrecognizedError
                })}
                type="search"
                placeholder="Search"
                isInvalid={errors.search?.type === "required" || errors.search?.type === "validate"}
                aria-label="Search"
              />
              <Form.Control.Feedback type="invalid">
                {errors.search?.message}
              </Form.Control.Feedback>
            </InputGroup>
            <Button variant="outline-success" type="submit" disabled={loading}>
              <i className="fa fa-search"></i>
            </Button>
          </Form>
          <br></br>
          {loading && <Spinner animation="border"></Spinner>}
          {!loading && (getAccountComponent(address) || (<p>{error}</p>))}
        </div>
      </Card.Body>
    </Card >
  );
}

export default ENS;
