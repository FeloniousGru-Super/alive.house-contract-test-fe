import { Button, Form, Typography, Input, notification } from "antd";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { getAliveRegistryAbi } from "../../utils/abis";
import { getAliveRegistryAddress } from "../../utils/contractAddress";

const UpgradeBand: React.FC = () => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let aliveRegistryContract = new ethers.Contract(
    getAliveRegistryAddress(),
    getAliveRegistryAbi(),
    signer
  );

  const [isUpgrade, setIsUpgrade] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(0);

  const handleUpgradeBand = async (value: any) => {
    let upgardedBandAddress = value.newband;
    setIsUpgrade(true);
    try {
      let upgradeBandTx = await aliveRegistryContract.upgradeAliveBandImp(
        upgardedBandAddress
      );
      await upgradeBandTx.wait();
      notification.success({
        message: "Upgrade Band Contract Successfully!",
      });
      getBalance();
    } catch (error: any) {
      notification.error({
        message: error["reason"],
      });
    }
    setIsUpgrade(false);
  };

  const getBalance = async () => {
    try {
      let currentVersion = await aliveRegistryContract.bandVersion();
      console.log("currentVersion : ", currentVersion);
      setCurrentVersion(Number(currentVersion));
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: error["reason"],
      });
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div>
      <Typography.Title level={3}>
        Upgrade Band (Current Version - {currentVersion})
      </Typography.Title>
      <Form onFinish={handleUpgradeBand}>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Please input band contract for upgrade!",
            },
          ]}
          name={"newband"}
          label={"Upgrade Band Address"}
        >
          <Input />
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit" loading={isUpgrade}>
            Upgrade
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default UpgradeBand;
