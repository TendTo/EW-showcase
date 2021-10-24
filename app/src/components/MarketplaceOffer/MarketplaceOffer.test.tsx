import { fireEvent, render, screen } from '@testing-library/react';
import { VoidSigner } from 'ethers';
import { Asset } from '../../types/MarketplaceEntities';
import MarketplaceCancelOffer from './MarketplaceCancelOffer';
import MarketplaceCreateOffer from './MarketplaceCreateOffer';

const signer = new VoidSigner("0x0");
const nonPublicAsset = new Asset("assetDID");
const publicUnmatchedAsset = new Asset("assetDID", "account", 1, 1, 1);
const matchedAsset = new Asset("assetDID", "account", 1, 1, 1, 1);
const update = () => { };

describe('MarketplaceCreateOffer component', () => {

  test('renders MarketplaceCreateOffer component on create offer', () => {
    const { container } = render(<MarketplaceCreateOffer asset={nonPublicAsset} updateAssets={update} />);

    const element = container.getElementsByClassName('fa-location-arrow');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceCreateOffer modal on create offer', () => {
    const { container } = render(<MarketplaceCreateOffer asset={nonPublicAsset} updateAssets={update} />);

    const element = container.getElementsByClassName('fa-location-arrow');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.CREATE_OFFER$/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders MarketplaceCreateOffer component on edit offer', () => {
    const { container } = render(<MarketplaceCreateOffer asset={publicUnmatchedAsset} updateAssets={update} />);

    const element = container.getElementsByClassName('fa-pencil-square-o');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceCreateOffer modal on edit offer', () => {
    const { container } = render(<MarketplaceCreateOffer asset={publicUnmatchedAsset} updateAssets={update} />);

    const element = container.getElementsByClassName('fa-pencil-square-o');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.EDIT_OFFER$/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders MarketplaceCreateOffer modal on matched offer', () => {
    const { container } = render(<MarketplaceCreateOffer asset={matchedAsset} updateAssets={update} />);

    const element = container.querySelector('[disabled]');
    expect(element).not.toBeNull();
  });
});

describe('MarketplaceCancelOffer component', () => {

  test('renders MarketplaceCancelOffer component', () => {
    const { container } = render(<MarketplaceCancelOffer asset={nonPublicAsset} updateAssets={update} />);

    const element = container.getElementsByClassName('fa-trash');
    expect(element).toHaveLength(1);
  });

  test('renders MarketplaceCancelOffer modal', () => {
    const { container } = render(<MarketplaceCancelOffer asset={nonPublicAsset} updateAssets={update} />);

    const element = container.getElementsByClassName('fa-trash');
    fireEvent.click(element[0]);
    const titleElement = screen.getByText(/^MARKETPLACE.CANCEL_OFFER$/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders MarketplaceCancelOffer modal on matched offer', () => {
    const { container } = render(<MarketplaceCancelOffer asset={matchedAsset} updateAssets={update} />);

    const element = container.querySelector('[disabled]');
    expect(element).not.toBeNull();
  });
});