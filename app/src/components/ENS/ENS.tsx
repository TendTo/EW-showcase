import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Web3 from 'web3';
import VoltaApi from '../../api/VoltaApi';
import strings from './ENS.json'

type Props = {
  web3?: Web3;
};

type FormInput = {
  search: string;
}

function ENS({ web3 }: Props) {
  const voltaApi = useRef(new VoltaApi());
  const error = useRef("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, handleSubmit, reset } = useForm<FormInput>();

  const onSubmit = ({ search }: FormInput) => {
    reset();
    setLoading(true);
    web3?.eth.ens.getAddress(search)
      .then(addr => {
        setAddress(addr);
      })
      .catch((err: Error) => {
        error.current = strings.errorGeneric;
        if (err.message.startsWith("The resolver at 0x0000000000000000000000000000000000000000"))
          error.current = strings.errorNotFound;
        console.error(err);
        setAddress("");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (address) {
      voltaApi.current.getEthBalance(address)
        .then(console.log);
    }
  }, [address]);


  return (
    <Card>
      <Card.Body>
        <Card.Title>ENS service</Card.Title>
        <div>
          <Form className="form-h" onSubmit={handleSubmit(onSubmit)}>
            <InputGroup hasValidation>
              <FormControl
                {...register('search', { required: true })}
                type="search"
                placeholder="Search"
                isInvalid={errors.search?.type === "required"}
                aria-label="Search"
              />
              <Form.Control.Feedback type="invalid">
                Insert either an ENS name or an address
              </Form.Control.Feedback>
            </InputGroup>
            <Button variant="outline-success" type="submit">
              <i className="fa fa-search"></i>
            </Button>
          </Form>
          <br></br>
          {(loading && <Spinner animation="border"></Spinner>)}
          {(!loading &&
            <p>{address || error.current}</p>
          )}
        </div>
      </Card.Body>
    </Card >
  );
}

export default ENS;
