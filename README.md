# BigBull_AI


[Project Flowchart](https://www.mermaidchart.com/app/projects/de08f005-1a1e-4177-9f4c-acbd14803885/diagrams/263f2a60-0834-4b63-b0d1-ebcfbf26c118/version/v0.1/edit)

# README

## System Architecture

### GPU Slice Management
```mermaid
classDiagram
    class GpuSliceManagerManager {
        +int min_memory
        +int max_memory
        +int default_compute
        +float oversubscription_limit
        +__init__(gpu_config: Dict)
        +_parse_memory(memory_str: str) : int
        +allocate_slice(request: Dict) : Dict
        +__del__()
    }

    class KubernetesControllerController {
        +str namespace
        +str service_account
        +Dict pod_limits
        +__init__(k8s_config: Dict)
        +create_pod(request: Dict, gpu_slice: Dict) : Dict
        +delete_pod(pod_name: str)
        +get_pod_status(pod_name: str) : str
    }

    GpuSliceManagerManager --> KubernetesControllerController : Calls
```

### Super-Agent System
```mermaid
graph TD;
    A[Super-Agent System] -->|Monitors Risks| B[Risk Analyzer Agent]
    A -->|Manages Liquidity| C[Liquidity Manager Agent]
    A -->|Executes Trades| D[Trader Agent]
    A -->|Analyzes Sentiment| E[Sentiment Analyzer Agent]
```

### Data Processing Workflow
```mermaid
graph TD;
    A[Data Preparation: Input CSVs -> Address Data] --> B[Preprocessing: Address Data -> Transformed Data, Vectorizer];
    B --> C[Model Training: Transformed Data, Labels -> Trained Model];
    C --> D[Inference & Prediction: Test Data, Model, Vectorizer -> Predictions Output];
    D --> E[Evaluation: Training Data, Predictions -> Accuracy Report];
```

### Trade Execution Sequence
```mermaid
sequenceDiagram
    participant MarketDataFetcher
    participant DEXAggregator
    participant LiquidityManager
    participant TradeExecutionAgent

    MarketDataFetcher->>DEXAggregator: Provide DEX Prices & Liquidity Data
    DEXAggregator->>LiquidityManager: Check Liquidity Levels
    LiquidityManager->>DEXAggregator: Return Available Liquidity
    DEXAggregator->>TradeExecutionAgent: Suggest Best Execution Route
    TradeExecutionAgent->>DEXAggregator: Execute Order
```

