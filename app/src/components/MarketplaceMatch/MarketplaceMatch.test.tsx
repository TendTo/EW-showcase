import { act, fireEvent, render, screen } from '@testing-library/react';
import Web3 from 'web3';
import { Asset, Demand, Match } from '../../types/MarketplaceEntities';
import MarketplaceAcceptMatch from './MarketplaceAcceptMatch';
import MarketplaceCancelMatch from './MarketplaceCancelMatch';
import MarketplaceDeleteMatch from './MarketplaceDeleteMatch';
import MarketplaceRejectMatch from './MarketplaceRejectMatch';
import MarketplaceMatches from './MarketplaceMatches';

const web3 = new Web3("http://localhost:8545");
const match = new Match(1);
const update = () => { };

describe('MarketplaceAcceptMatch component', () => {

  test('renders MarketplaceAcceptMatch component', () => {
    const { container } = render(<MarketplaceAcceptMatch web3={web3} account="account" match={match} updateMatches={update} />);

    const element = container.getElementsByClassName('fa-check');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceAcceptMatch modal', () => {
    const { container } = render(<MarketplaceAcceptMatch web3={web3} account="account" match={match} updateMatches={update} />);

    const element = container.getElementsByClassName('fa-check');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.ACCEPT_MATCH$/i);
    expect(titleElement).toBeInTheDocument();
  });
});

describe('MarketplaceCancelMatch component', () => {

  test('renders MarketplaceCancelMatch component', () => {
    const { container } = render(<MarketplaceCancelMatch web3={web3} account="account" match={match} updateMatch={update} />);

    const element = container.getElementsByClassName('fa-times');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceCancelMatch modal', () => {
    const { container } = render(<MarketplaceCancelMatch web3={web3} account="account" match={match} updateMatch={update} />);

    const element = container.getElementsByClassName('fa-times');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.DELETE_MATCH$/i);
    expect(titleElement).toBeInTheDocument();
  });
});

describe('MarketplaceDeleteMatch component', () => {

  test('renders MarketplaceDeleteMatch component', () => {
    const { container } = render(<MarketplaceDeleteMatch web3={web3} account="account" match={match} updateMatches={update} />);

    const element = container.getElementsByClassName('fa-times');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceDeleteMatch modal', () => {
    const { container } = render(<MarketplaceDeleteMatch web3={web3} account="account" match={match} updateMatches={update} />);

    const element = container.getElementsByClassName('fa-times');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.DELETE_MATCH$/i);
    expect(titleElement).toBeInTheDocument();
  });
});

describe('MarketplaceRejectMatch component', () => {

  test('renders MarketplaceRejectMatch component', () => {
    const { container } = render(<MarketplaceRejectMatch web3={web3} account="account" match={match} updateMatches={update} />);

    const element = container.getElementsByClassName('fa-times');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceRejectMatch modal', () => {
    const { container } = render(<MarketplaceRejectMatch web3={web3} account="account" match={match} updateMatches={update} />);

    const element = container.getElementsByClassName('fa-times');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.REJECT_MATCH$/i);
    expect(titleElement).toBeInTheDocument();
  });
});
