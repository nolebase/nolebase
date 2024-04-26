---
tags:
  - 开发/区块链/Web3
  - 开发/区块链/Ethereum/ETH/以太坊/API/JSONRPC
  - 开发/语言/Golang
---

# 测试 Ethereum RPC 连通性

## 使用 Golang 代码进行测试

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/rpc"
)

func main() {
	dialCtx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	rpcClient, err := rpc.DialContext(dialCtx, "RPC 端点")
	if err != nil {
		panic(err)
	}

	ethClient := ethclient.NewClient(rpcClient)

	chainIDCtx, cancelChainIDCtx := context.WithTimeout(context.Background(), time.Second*5)
	defer cancelChainIDCtx()

	chainID, err := ethClient.ChainID(chainIDCtx)
	if err != nil {
		panic(err)
	}

	blockNumberCtx, cancelBlockNumberCtx := context.WithTimeout(context.Background(), time.Second*5)
	defer cancelBlockNumberCtx()

	blockNumber, err := ethClient.BlockNumber(blockNumberCtx)
	if err != nil {
		panic(err)
	}

	fmt.Println("ChainID:", chainID.String())
	fmt.Println("BlockNumber:", blockNumber)
}
```

