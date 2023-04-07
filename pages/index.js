import { compress } from '@/next.config';
import { useState, useEffect } from 'react';
import contract from '../components/contract';
import web3 from '../components/web3';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '../public/logo.webp';
import buy from '../public/buy.webp';

export default function Home() {
  const router = useRouter();

  const [asset, setAsset] = useState(null);
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newValue, setValue] = useState('');
  const [transferAsset, setTransferAsset] = useState('');
  const [account, setAccount] = useState('');
  const { id } = router.query;


  useEffect(() => {
    async function loadAccount() {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    loadAccount();
    if (id) {
      gameAssets(id)
    }
  },[id]);

  const createAsset = async () => {
    await contract.methods.createGameAsset(assetName, assetValue).send({
      from: account,
      gas: 500000,
    });
  };

  const exchangeAsset = async (assetId, newOwner) => {
    console.log(assetId, newOwner)
    if(newOwner == account){
      alert("you already own this asset")
    }else{
      await contract.methods.exchangeGameAsset(assetId, newOwner).send({
        from: account,
        gas: 50000,
        value: asset['value'],
      });
    }
  };

  const gameAssets = async (assetId) => {
    const asset = await contract.methods.gameAssets(assetId).call();
    setAsset(asset)
    return asset
  }

  return (
    <div className='flex flex-col items-center justify-between h-screen'>
      <div className='p-4'>
        <Image
          src={logo}
          alt='user profile picture'
        />
      </div>
      <div className='flex flex-col items-center'>
        {/* <div >
          <h1>Game Asset Exchange</h1>
          <h1>ID: {id}</h1>

          <h2>Create a new asset</h2>
          <label>
            Name:
            <input type="text" value={assetName} onChange={(e) => setAssetName(e.target.value)} />
          </label>
          <br />
          <label>
            Value:
            <input type="number" value={assetValue} onChange={(e) => setAssetValue(e.target.value)} />
          </label>
          <br />
          <button onClick={createAsset}>Create</button>

          <h2>Exchange an asset</h2>
          <label>
            Asset ID:
            <input type="number" value={transferAsset} onChange={(e) => setTransferAsset(e.target.value)} />
          </label>
          <br />
          <label>
            New Owner:
            <input type="text" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />
          </label>
          <br />
          <label>
        Value:
        <input type="number" value={newValue} onChange={(e) => setValue(e.target.value)}/>
      </label>
          <br />
          <button onClick={() => gameAssets(transferAsset)}>asset</button>
          <br />

        </div> */}
        <div className='flex flex-col items-center'>
          <div>
            <Image src={logo}></Image>
          </div>
          {asset && <div className='text-black text-xl p-8'>
            <h1>Item: {asset['name']}</h1>
            <h1>Owner: {asset["owner"]}</h1>
            <h1>Value: {(parseFloat(asset["value"]) / 10**18).toFixed(18)} OKT</h1>
          </div>}
        </div>
        <div>
          <button className='rounded-lg hover:shadow-lg bg-black' onClick={() => exchangeAsset(id, account)}>
            <Image
              src={buy}
              width={120}
              height={100}
              >

            </Image>
            
          </button>

        </div>

      </div>
      <div></div>
    </div>
  );
}
