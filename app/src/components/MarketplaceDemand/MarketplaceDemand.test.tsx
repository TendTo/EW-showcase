import { fireEvent, render, screen } from '@testing-library/react';
import Web3 from 'web3'; import { Demand } from '../../types/MarketplaceEntities';
import MarketplaceCreateDemand from './MarketplaceCreateDemand';
import MarketplaceCancelDemand from './MarketplaceCancelDemand';

const web3 = new Web3("http://localhost:8545");
const nonPublicDemand = new Demand("buyerDID");
const publicUnmatchedDemand = new Demand("buyerDID", 1, 1);
const matchedDemand = new Demand("buyerDID", 1, 1, true);
const update = () => { };

describe('MarketplaceCreateDemand component', () => {

  test('renders MarketplaceCreateDemand component on create offer', () => {
    const { container } = render(<MarketplaceCreateDemand web3={web3} demand={nonPublicDemand} updateDemand={update} />);

    const element = container.getElementsByClassName('fa-location-arrow');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceCreateDemand modal on create offer', () => {
    const { container } = render(<MarketplaceCreateDemand web3={web3} demand={nonPublicDemand} updateDemand={update} />);

    const element = container.getElementsByClassName('fa-location-arrow');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.CREATE_DEMAND$/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders MarketplaceCreateDemand component on edit offer', () => {
    const { container } = render(<MarketplaceCreateDemand web3={web3} demand={publicUnmatchedDemand} updateDemand={update} />);

    const element = container.getElementsByClassName('fa-pencil-square-o');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceCreateDemand modal on edit offer', () => {
    const { container } = render(<MarketplaceCreateDemand web3={web3} demand={publicUnmatchedDemand} updateDemand={update} />);

    const element = container.getElementsByClassName('fa-pencil-square-o');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.EDIT_DEMAND$/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders MarketplaceCreateDemand modal on matched offer', () => {
    const { container } = render(<MarketplaceCreateDemand web3={web3} demand={matchedDemand} updateDemand={update} />);

    const element = container.querySelector('[disabled]');
    expect(element).not.toBeNull();
  });
});

describe('MarketplaceCancelDemand component', () => {

  test('renders MarketplaceCancelDemand component', () => {
    const { container } = render(<MarketplaceCancelDemand web3={web3} demand={nonPublicDemand} updateDemand={update} />);

    const element = container.getElementsByClassName('fa-trash');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceCancelDemand modal', () => {
    const { container } = render(<MarketplaceCancelDemand web3={web3} demand={nonPublicDemand} updateDemand={update} />);

    const element = container.getElementsByClassName('fa-trash');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.CANCEL_DEMAND$/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders MarketplaceCancelDemand modal on matched offer', () => {
    const { container } = render(<MarketplaceCancelDemand web3={web3} demand={matchedDemand} updateDemand={update} />);

    const element = container.querySelector('[disabled]');
    expect(element).not.toBeNull();
  });
});