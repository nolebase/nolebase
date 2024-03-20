---
tags:
  - AI
  - AI/大语言模型
  - AI/大语言模型/GPT-2
  - AI/训练/Megatron-LM
  - AI/PyTorch
  - AI/硬件/GPU/NVIDIA/GPU
  - AI/数据集/OSCAR
  - AI/算法/CUDA
---
# 用 Megatron-LM 训练一个 GPT-2

## 环境准备

准备一台有 NVIDIA 显卡和安装了 NVIDIA 驱动和 CUDA 的设备。

### 通过 NVIDIA 的 Docker / OCI 镜像启动环境

引用 NVIDIA 官方的镜像

```shell
docker pull nvcr.io/nvidia/pytorch:23.10-py3
```

```shell
docker run -it nvcr.io/nvidia/pytorch:23.10-py3 /bin/bash
```

### 额外依赖安装

然后安装一下额外的依赖

```shell
pip install nltk numpy parameterized pybind11 regex six tensorboard transformers 'black==21.4b0' 'isort>=5.5.4'
```

### 下载 Megatron-LM 源代码

下载 Megatron-LM 的源代码，我们需要里面的脚本执行数据处理和训练任务

```shell
cd Git
```

```shell
git clone https://github.com/NVIDIA/megatron-lm.git
```

下载完成之后返回之前的目录

```shell
cd ../..
```

## 获取和处理训练数据

创建一个存放这些数据的目录

```shell
mkdir -p Models/gpt-2/data
```

```shell
cd Models/gpt-2/data
```

在接下来的文档中，将会使用 1GB 79K-record 的 JSON 格式的 OSCAR 数据集。

可以通过下面的命令下载数据集：

```shell
wget https://huggingface.co/bigscience/misc-test-data/resolve/main/stas/oscar-1GB.jsonl.xz
wget https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-vocab.json
wget https://s3.amazonaws.com/models.huggingface.co/bert/gpt2-merges.txt
```

下载之后需要解压 `oscar-1GB.jsonl.xz` 数据集

```shell
xz -d oscar-1GB.jsonl.xz
```

结束之后返回到 `Models/gpt-2` 目录

```shell
cd ..
```

现在开始预处理数据，调用之前下载好的 megatron-lm 的源代码中包含的 `preprocess_data.py` 进行数据处理

```shell
python ../../Git/megatron-lm/tools/preprocess_data.py \
  --input ./data/oscar-1GB.jsonl \
  --output-prefix meg-gpt2 \
  --vocab-file ./data/gpt2-vocab.json \
  --tokenizer-type GPT2BPETokenizer \
  --merge-file ./data/gpt2-merges.txt \
  --append-eod \
  --workers 8
```

如果成功的话，应该会显示这样的信息：

```shell
$ python tools/preprocess_data.py \
  --input ../../Models/gpt-2/data/oscar-1GB.jsonl \
  --output-prefix meg-gpt2 \
  --vocab-file ../../Models/gpt-2/data/gpt2-vocab.json \
  --tokenizer-type GPT2BPETokenizer \
  --merge-file ../../Models/gpt-2/data/gpt2-merges.txt \
  --append-eod \
  --workers 8
Zarr-based strategies will not be registered because of missing packages
Opening ./data/oscar-1GB.jsonl
Time to startup: 0.34363460540771484
Processed 1000 documents (433.03698501732487 docs/s, 5.381141666650319 MB/s).
Processed 2000 documents (515.5098974659498 docs/s, 6.460766812713121 MB/s).
Processed 3000 documents (547.6395321994974 docs/s, 7.101133360189605 MB/s).
Processed 4000 documents (590.6084364356041 docs/s, 7.617175617060292 MB/s).
Processed 5000 documents (573.5710453002679 docs/s, 7.554493901538309 MB/s).
Processed 6000 documents (623.1273735138657 docs/s, 8.179635462737336 MB/s).
Processed 7000 documents (633.9426166109256 docs/s, 8.272759185639483 MB/s).
Processed 8000 documents (660.1344351958044 docs/s, 8.553866632487171 MB/s).
Processed 9000 documents (647.7952028223743 docs/s, 8.3678520892112 MB/s).
Processed 10000 documents (658.8634135488786 docs/s, 8.545661855181228 MB/s).
# ...
# 中间省略超级多内容
# ...
Processed 70000 documents (757.3496308210075 docs/s, 9.749606755141295 MB/s).
Processed 71000 documents (758.9059010948939 docs/s, 9.771822056903664 MB/s).
Processed 72000 documents (757.2054776253033 docs/s, 9.760984420542295 MB/s).
Processed 73000 documents (760.2401144979731 docs/s, 9.793640123073587 MB/s).
Processed 74000 documents (760.7177564406554 docs/s, 9.80423807920419 MB/s).
Processed 75000 documents (761.9462717631283 docs/s, 9.826400662934104 MB/s).
Processed 76000 documents (763.4382208273821 docs/s, 9.843172079012716 MB/s).
Processed 77000 documents (765.3122602352142 docs/s, 9.86178378657026 MB/s).
Processed 78000 documents (767.020968993085 docs/s, 9.884495364192372 MB/s).
Processed 79000 documents (765.6928841461199 docs/s, 9.88378937195913 MB/s).
```

处理之后应该是这样的结果

```shell
$ ls -la
total 459264
drwxr-sr-x 4 root users      4096 Jan 24 10:59 .
drwxr-sr-x 3 root users      4096 Jan 24 10:48 ..
drwxr-sr-x 3 root users      4096 Jan 24 09:30 data
-rw-r--r-- 1 root users 468678968 Jan 24 10:59 meg-gpt2_text_document.bin
-rw-r--r-- 1 root users   1580042 Jan 24 10:59 meg-gpt2_text_document.idx
```

我们将处理好的数据移动到 `data` 目录下面

```shell
mv meg-gpt2* ./data
```

## 训练

### 训练模型

接下来我们创建一个可以反复使用的脚本来训练 GPT-2 模型，可以像下面这样配置来完成单机单卡的训练步骤

```shell
# 注意要设置这个环境变量，要不然会报错提示：
# RuntimeError: Using async gradient all reduce requires setting the environment variable CUDA_DEVICE_MAX_CONNECTIONS to 1
export CUDA_DEVICE_MAX_CONNECTIONS=1

# 注意要设置这个环境变量，要不然会报错提示：
# Note that --use_env is set by default in torchrun.
# If your script expects `--local_rank` argument to be set, please
# change it to read from `os.environ['LOCAL_RANK']` instead. See
# https://pytorch.org/docs/stable/distributed.html#launch-utility for
# further instructions
export LOCAL_RANK=0

python -m torch.distributed.launch \
    --nproc_per_node 1 \
    --nnodes 1 \
    --node_rank 0 \
    --master_addr localhost \
    --master_port 6000 \
    ../../Git/megatron-lm/pretrain_gpt.py \
    --tensor-model-parallel-size 1 \
    --pipeline-model-parallel-size 1 \
    --num-layers 24 \
    --hidden-size 1024 \
    --num-attention-heads 16 \
    --micro-batch-size 4 \
    --global-batch-size 8 \
    --seq-length 1024 \
    --max-position-embeddings 1024 \
    --train-iters 1000 \
    --lr-decay-iters 320000 \
    --save ./checkpoints/gpt-2 \
    --load ./checkpoints/gpt-2 \
    --data-path ./data/meg-gpt2_text_document \
    --vocab-file ./data/gpt2-vocab.json \
    --merge-file ./data/gpt2-merges.txt \
    --split 949,50,1 \
    --distributed-backend nccl \
    --lr 0.00015 \
    --lr-decay-style cosine \
    --min-lr 1.0e-5 \
    --weight-decay 1e-2 \
    --clip-grad 1.0 \
    --lr-warmup-fraction .01 \
    --recompute-activations \
    --log-interval 10 \
    --save-interval 1 \
    --eval-interval 1 \
    --eval-iters 10 \
    --fp16
```

其中：

- `--nproc_per_node` 参数表示每个 worker 有多少个 GPU
- `--nnodes` 参数表示有多少个 worker
- `--node_rank` 参数表示当前的 worker 编号为多少

如果你修改了 GPU 的数量或者 worker 被增加，需要着重修改这三个参数才能继续训练。

额外需要注意的是

`--hidden-size`，`--num-attention-heads`，`--micro-batch-size`，`--global-batch-size` 这几个参数也与 GPU 数量和 worker 数量有关。

- 对于 `--global-batch-size` 参数，必须要保证 `worker` 的数量 x `GPU` 的数量是能被 `--global-batch-size` 整除的。
- `--hidden-size` 要能被 `--num-attention-heads` 整除

准备好之后记得分配权限

```shell
chmod +x ./train.sh
```

分配完成权限之后调用这个 `train.sh` 的脚本就可以开始训练了

```shell
$ ./train.sh
Zarr-based strategies will not be registered because of missing packages
using world size: 1, data-parallel size: 1, context-parallel size: 1 tensor-model-parallel size: 1, pipeline-model-parallel size: 1
WARNING: Setting args.overlap_p2p_comm to False since non-interleaved schedule does not support overlapping p2p communication
using torch.float16 for parameters ...

# ...
# 中间省略超级多内容
# ...

> learning rate decay style: cosine
WARNING: could not find the metadata file ./checkpoints/gpt-2/latest_checkpointed_iteration.txt
    will not load any checkpoints and will start from random
/usr/local/lib/python3.8/dist-packages/torch/distributed/distributed_c10d.py:2533: UserWarning: torch.distributed._all_gather_base is a private function and will be deprecated. Please use torch.distributed.all_gather_into_tensor instead.
  warnings.warn(
(min, max) time across ranks (ms):
    load-checkpoint ................................: (0.19, 0.19)
[after model, optimizer, and learning rate scheduler are built] datetime: 2024-01-24 11:10:16
> building train, validation, and test datasets ...
 > datasets target sizes (minimum size):
    train:      8000
    validation: 80080
    test:       80
> building train, validation, and test datasets for GPT ...
INFO:megatron.core.datasets.blended_megatron_dataset_config:Let split_matrix = [(0, 0.949), (0.949, 0.999), (0.999, 1.0)]
INFO:megatron.core.datasets.indexed_dataset:Load the _IndexReader from ./data/meg-gpt2_text_document.idx
INFO:megatron.core.datasets.indexed_dataset:    Extract the sequence lengths
INFO:megatron.core.datasets.indexed_dataset:    Extract the sequence pointers
INFO:megatron.core.datasets.indexed_dataset:    Extract the document indices
INFO:megatron.core.datasets.indexed_dataset:> total number of sequences: 79000
INFO:megatron.core.datasets.indexed_dataset:> total number of documents: 79000
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset train indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 743f9c78682483773343914511a6c2a5-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 743f9c78682483773343914511a6c2a5-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 743f9c78682483773343914511a6c2a5-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 216895
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 1
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset valid indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 81082
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 7
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset test indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 368
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 1
> finished creating GPT datasets ...
[after dataloaders are built] datetime: 2024-01-24 11:10:16
done with setup ...
(min, max) time across ranks (ms):
    model-and-optimizer-setup ......................: (141.53, 141.53)
    train/valid/test-data-iterators-setup ..........: (596.36, 596.36)
training ...
[before the start of training step] datetime: 2024-01-24 11:10:16
(min, max) time across ranks (ms):
    evaluate .......................................: (2101.26, 2101.26)
---------------------------------------------------------------------------------------------
 validation loss at iteration 1 | lm loss value: 1.103246E+01 | lm loss PPL: 6.184932E+04 |
---------------------------------------------------------------------------------------------
saving checkpoint at iteration       1 to ./checkpoints/gpt-2
  successfully saved checkpoint at iteration       1 to ./checkpoints/gpt-2
(min, max) time across ranks (ms):
    save-checkpoint ................................: (21027.08, 21027.08)
(min, max) time across ranks (ms):
    evaluate .......................................: (1795.46, 1795.46)
---------------------------------------------------------------------------------------------
 validation loss at iteration 2 | lm loss value: 1.102900E+01 | lm loss PPL: 6.163599E+04 |
---------------------------------------------------------------------------------------------
saving checkpoint at iteration       2 to ./checkpoints/gpt-2
```

::: details 完整的训练开始的时候的输出

```shell
$ ./train.sh
Zarr-based strategies will not be registered because of missing packages
using world size: 1, data-parallel size: 1, context-parallel size: 1 tensor-model-parallel size: 1, pipeline-model-parallel size: 1
WARNING: Setting args.overlap_p2p_comm to False since non-interleaved schedule does not support overlapping p2p communication
using torch.float16 for parameters ...
------------------------ arguments ------------------------
  accumulate_allreduce_grads_in_fp32 .............. False
  adam_beta1 ...................................... 0.9
  adam_beta2 ...................................... 0.999
  adam_eps ........................................ 1e-08
  add_bias_linear ................................. True
  add_position_embedding .......................... True
  adlr_autoresume ................................. False
  adlr_autoresume_interval ........................ 1000
  apply_layernorm_1p .............................. False
  apply_query_key_layer_scaling ................... False
  apply_residual_connection_post_layernorm ........ False
  apply_rope_fusion ............................... True
  async_tensor_model_parallel_allreduce ........... True
  attention_dropout ............................... 0.1
  attention_softmax_in_fp32 ....................... False
  barrier_with_L1_time ............................ True
  bert_binary_head ................................ True
  bert_embedder_type .............................. megatron
  bert_load ....................................... None
  bf16 ............................................ False
  bias_dropout_fusion ............................. True
  bias_gelu_fusion ................................ True
  bias_swiglu_fusion .............................. True
  biencoder_projection_dim ........................ 0
  biencoder_shared_query_context_model ............ False
  block_data_path ................................. None
  check_for_nan_in_loss_and_grad .................. True
  classes_fraction ................................ 1.0
  clip_grad ....................................... 1.0
  clone_scatter_output_in_embedding ............... True
  consumed_train_samples .......................... 0
  consumed_valid_samples .......................... 0
  context_parallel_size ........................... 1
  data_cache_path ................................. None
  data_parallel_random_init ....................... False
  data_parallel_size .............................. 1
  data_path ....................................... ['./data/meg-gpt2_text_document']
  data_per_class_fraction ......................... 1.0
  data_sharding ................................... True
  dataloader_type ................................. single
  decoder_num_layers .............................. None
  decoder_seq_length .............................. None
  delay_grad_reduce ............................... True
  delay_param_gather .............................. False
  dino_bottleneck_size ............................ 256
  dino_freeze_last_layer .......................... 1
  dino_head_hidden_size ........................... 2048
  dino_local_crops_number ......................... 10
  dino_local_img_size ............................. 96
  dino_norm_last_layer ............................ False
  dino_teacher_temp ............................... 0.07
  dino_warmup_teacher_temp ........................ 0.04
  dino_warmup_teacher_temp_epochs ................. 30
  distribute_saved_activations .................... False
  distributed_backend ............................. nccl
  distributed_timeout_minutes ..................... 10
  embedding_path .................................. None
  empty_unused_memory_level ....................... 0
  encoder_num_layers .............................. 24
  encoder_seq_length .............................. 1024
  end_weight_decay ................................ 0.01
  eod_mask_loss ................................... False
  eval_interval ................................... 1
  eval_iters ...................................... 10
  evidence_data_path .............................. None
  exit_duration_in_mins ........................... None
  exit_interval ................................... None
  exit_on_missing_checkpoint ...................... False
  exit_signal_handler ............................. False
  expert_model_parallel_size ...................... 1
  ffn_hidden_size ................................. 4096
  finetune ........................................ False
  fp16 ............................................ True
  fp16_lm_cross_entropy ........................... False
  fp32_residual_connection ........................ False
  fp8 ............................................. None
  fp8_amax_compute_algo ........................... most_recent
  fp8_amax_history_len ............................ 1
  fp8_interval .................................... 1
  fp8_margin ...................................... 0
  fp8_wgrad ....................................... True
  global_batch_size ............................... 8
  gradient_accumulation_fusion .................... True
  group_query_attention ........................... False
  head_lr_mult .................................... 1.0
  hidden_dropout .................................. 0.1
  hidden_size ..................................... 1024
  hysteresis ...................................... 2
  ict_head_size ................................... None
  ict_load ........................................ None
  img_h ........................................... 224
  img_w ........................................... 224
  indexer_batch_size .............................. 128
  indexer_log_interval ............................ 1000
  inference_batch_times_seqlen_threshold .......... 512
  init_method_std ................................. 0.02
  init_method_xavier_uniform ...................... False
  initial_loss_scale .............................. 4294967296
  iter_per_epoch .................................. 1250
  kv_channels ..................................... 64
  lazy_mpu_init ................................... None
  load ............................................ ./checkpoints/gpt-2
  local_rank ...................................... None
  log_batch_size_to_tensorboard ................... False
  log_interval .................................... 10
  log_learning_rate_to_tensorboard ................ True
  log_loss_scale_to_tensorboard ................... True
  log_memory_to_tensorboard ....................... False
  log_num_zeros_in_grad ........................... False
  log_params_norm ................................. False
  log_throughput .................................. False
  log_timers_to_tensorboard ....................... False
  log_validation_ppl_to_tensorboard ............... False
  log_world_size_to_tensorboard ................... False
  loss_scale ...................................... None
  loss_scale_window ............................... 1000
  lr .............................................. 0.00015
  lr_decay_iters .................................. 320000
  lr_decay_samples ................................ None
  lr_decay_style .................................. cosine
  lr_warmup_fraction .............................. 0.01
  lr_warmup_init .................................. 0.0
  lr_warmup_iters ................................. 0
  lr_warmup_samples ............................... 0
  make_vocab_size_divisible_by .................... 128
  manual_gc ....................................... False
  manual_gc_eval .................................. True
  manual_gc_interval .............................. 0
  mask_factor ..................................... 1.0
  mask_prob ....................................... 0.15
  mask_type ....................................... random
  masked_softmax_fusion ........................... True
  max_position_embeddings ......................... 1024
  max_tokens_to_oom ............................... 12000
  merge_file ...................................... ./data/gpt2-merges.txt
  micro_batch_size ................................ 4
  min_loss_scale .................................. 1.0
  min_lr .......................................... 1e-05
  moe_grouped_gemm ................................ False
  nccl_communicator_config_path ................... None
  no_load_optim ................................... None
  no_load_rng ..................................... None
  no_persist_layer_norm ........................... False
  no_save_optim ................................... None
  no_save_rng ..................................... None
  norm_epsilon .................................... 1e-05
  normalization ................................... LayerNorm
  num_attention_heads ............................. 16
  num_channels .................................... 3
  num_classes ..................................... 1000
  num_experts ..................................... None
  num_layers ...................................... 24
  num_layers_per_virtual_pipeline_stage ........... None
  num_query_groups ................................ 1
  num_workers ..................................... 2
  onnx_safe ....................................... None
  openai_gelu ..................................... False
  optimizer ....................................... adam
  output_bert_embeddings .......................... False
  overlap_grad_reduce ............................. False
  overlap_p2p_comm ................................ False
  overlap_param_gather ............................ False
  override_opt_param_scheduler .................... False
  params_dtype .................................... torch.float16
  patch_dim ....................................... 16
  perform_initialization .......................... True
  pipeline_model_parallel_size .................... 1
  pipeline_model_parallel_split_rank .............. None
  position_embedding_type ......................... learned_absolute
  profile ......................................... False
  profile_ranks ................................... [0]
  profile_step_end ................................ 12
  profile_step_start .............................. 10
  query_in_block_prob ............................. 0.1
  rampup_batch_size ............................... None
  rank ............................................ 0
  recompute_granularity ........................... selective
  recompute_method ................................ None
  recompute_num_layers ............................ None
  reset_attention_mask ............................ False
  reset_position_ids .............................. False
  retriever_report_topk_accuracies ................ []
  retriever_score_scaling ......................... False
  retriever_seq_length ............................ 256
  retro_add_retriever ............................. False
  retro_attention_gate ............................ 1
  retro_cyclic_train_iters ........................ None
  retro_encoder_attention_dropout ................. 0.1
  retro_encoder_hidden_dropout .................... 0.1
  retro_encoder_layers ............................ 2
  retro_num_neighbors ............................. 2
  retro_num_retrieved_chunks ...................... 2
  retro_return_doc_ids ............................ False
  retro_verify_neighbor_count ..................... True
  retro_workdir ................................... None
  rotary_percent .................................. 1.0
  rotary_seq_len_interpolation_factor ............. None
  sample_rate ..................................... 1.0
  save ............................................ ./checkpoints/gpt-2
  save_interval ................................... 1
  scatter_gather_tensors_in_pipeline .............. True
  seed ............................................ 1234
  seq_length ...................................... 1024
  sequence_parallel ............................... False
  sgd_momentum .................................... 0.9
  short_seq_prob .................................. 0.1
  skip_train ...................................... False
  spec ............................................ None
  split ........................................... 949,50,1
  squared_relu .................................... False
  standalone_embedding_stage ...................... False
  start_weight_decay .............................. 0.01
  swiglu .......................................... False
  swin_backbone_type .............................. tiny
  tensor_model_parallel_size ...................... 1
  tensorboard_dir ................................. None
  tensorboard_log_interval ........................ 1
  tensorboard_queue_size .......................... 1000
  test_data_path .................................. None
  timing_log_level ................................ 0
  timing_log_option ............................... minmax
  titles_data_path ................................ None
  tokenizer_model ................................. None
  tokenizer_type .................................. GPT2BPETokenizer
  tp_comm_bulk_dgrad .............................. True
  tp_comm_bulk_wgrad .............................. True
  tp_comm_overlap ................................. False
  tp_comm_overlap_cfg ............................. None
  tp_comm_split_ag ................................ True
  tp_comm_split_rs ................................ True
  train_data_path ................................. None
  train_iters ..................................... 1000
  train_samples ................................... None
  transformer_impl ................................ local
  transformer_pipeline_model_parallel_size ........ 1
  untie_embeddings_and_output_weights ............. False
  use_checkpoint_args ............................. False
  use_checkpoint_opt_param_scheduler .............. False
  use_cpu_initialization .......................... None
  use_distributed_optimizer ....................... False
  use_flash_attn .................................. False
  use_mcore_models ................................ False
  use_one_sent_docs ............................... False
  use_ring_exchange_p2p ........................... False
  use_rotary_position_embeddings .................. False
  valid_data_path ................................. None
  variable_seq_lengths ............................ False
  virtual_pipeline_model_parallel_size ............ None
  vision_backbone_type ............................ vit
  vision_pretraining .............................. False
  vision_pretraining_type ......................... classify
  vocab_extra_ids ................................. 0
  vocab_file ...................................... ./data/gpt2-vocab.json
  vocab_size ...................................... None
  wandb_exp_name ..................................
  wandb_project ...................................
  wandb_save_dir ..................................
  weight_decay .................................... 0.01
  weight_decay_incr_style ......................... constant
  world_size ...................................... 1
-------------------- end of arguments ---------------------
setting number of micro-batches to constant 2
> building GPT2BPETokenizer tokenizer ...
 > padded vocab (size: 50257) with 47 dummy tokens (new size: 50304)
> initializing torch distributed ...
> initialized tensor model parallel with size 1
> initialized pipeline model parallel with size 1
> setting random seeds to 1234 ...
> compiling dataset index builder ...
make: Entering directory '/home/neko/Git/megatron-lm/megatron/core/datasets'
make: Nothing to be done for 'default'.
make: Leaving directory '/home/neko/Git/megatron-lm/megatron/core/datasets'
>>> done with dataset index builder. Compilation time: 0.123 seconds
> compiling and loading fused kernels ...
>>> done with compiling and loading fused kernels. Compilation time: 1.025 seconds
time to initialize megatron (seconds): 2.810
[after megatron is initialized] datetime: 2024-01-24 11:10:16
building GPT model ...
 > number of parameters on (tensor, pipeline) model parallel rank (0, 0): 354871296
INFO:megatron.core.distributed.grad_buffer:Number of buckets for gradient all-reduce / reduce-scatter: 1
INFO:megatron.core.distributed.grad_buffer:Params for bucket 1 (354871296 elements):
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.final_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.embedding.word_embeddings.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.final_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.embedding.position_embeddings.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.self_attention.query_key_value.bias
> learning rate decay style: cosine
WARNING: could not find the metadata file ./checkpoints/gpt-2/latest_checkpointed_iteration.txt
    will not load any checkpoints and will start from random
/usr/local/lib/python3.8/dist-packages/torch/distributed/distributed_c10d.py:2533: UserWarning: torch.distributed._all_gather_base is a private function and will be deprecated. Please use torch.distributed.all_gather_into_tensor instead.
  warnings.warn(
(min, max) time across ranks (ms):
    load-checkpoint ................................: (0.19, 0.19)
[after model, optimizer, and learning rate scheduler are built] datetime: 2024-01-24 11:10:16
> building train, validation, and test datasets ...
 > datasets target sizes (minimum size):
    train:      8000
    validation: 80080
    test:       80
> building train, validation, and test datasets for GPT ...
INFO:megatron.core.datasets.blended_megatron_dataset_config:Let split_matrix = [(0, 0.949), (0.949, 0.999), (0.999, 1.0)]
INFO:megatron.core.datasets.indexed_dataset:Load the _IndexReader from ./data/meg-gpt2_text_document.idx
INFO:megatron.core.datasets.indexed_dataset:    Extract the sequence lengths
INFO:megatron.core.datasets.indexed_dataset:    Extract the sequence pointers
INFO:megatron.core.datasets.indexed_dataset:    Extract the document indices
INFO:megatron.core.datasets.indexed_dataset:> total number of sequences: 79000
INFO:megatron.core.datasets.indexed_dataset:> total number of documents: 79000
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset train indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 743f9c78682483773343914511a6c2a5-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 743f9c78682483773343914511a6c2a5-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 743f9c78682483773343914511a6c2a5-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 216895
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 1
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset valid indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 81082
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 7
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset test indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 368
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 1
> finished creating GPT datasets ...
[after dataloaders are built] datetime: 2024-01-24 11:10:16
done with setup ...
(min, max) time across ranks (ms):
    model-and-optimizer-setup ......................: (141.53, 141.53)
    train/valid/test-data-iterators-setup ..........: (596.36, 596.36)
training ...
[before the start of training step] datetime: 2024-01-24 11:10:16
(min, max) time across ranks (ms):
    evaluate .......................................: (2101.26, 2101.26)
---------------------------------------------------------------------------------------------
 validation loss at iteration 1 | lm loss value: 1.103246E+01 | lm loss PPL: 6.184932E+04 |
---------------------------------------------------------------------------------------------
saving checkpoint at iteration       1 to ./checkpoints/gpt-2
  successfully saved checkpoint at iteration       1 to ./checkpoints/gpt-2
(min, max) time across ranks (ms):
    save-checkpoint ................................: (21027.08, 21027.08)
(min, max) time across ranks (ms):
    evaluate .......................................: (1795.46, 1795.46)
---------------------------------------------------------------------------------------------
 validation loss at iteration 2 | lm loss value: 1.102900E+01 | lm loss PPL: 6.163599E+04 |
---------------------------------------------------------------------------------------------
saving checkpoint at iteration       2 to ./checkpoints/gpt-2
```

:::
### 恢复训练

假设出现了错误，比如这样被我主动中断了训练，此时的训练迭代次数（iteration）是 4：

```shell
saving checkpoint at iteration       4 to ./checkpoints/gpt-2
^CWARNING:torch.distributed.elastic.agent.server.api:Received 2 death signal, shutting down workers
WARNING:torch.distributed.elastic.multiprocessing.api:Sending process 5903 closing signal SIGINT
Traceback (most recent call last):
  File "../../Git/megatron-lm/pretrain_gpt.py", line 198, in <module>
    pretrain(train_valid_test_datasets_provider,
  File "/home/neko/Git/megatron-lm/megatron/training.py", line 182, in pretrain
    iteration = train(forward_step_func,
  File "/home/neko/Git/megatron-lm/megatron/training.py", line 858, in train
    save_checkpoint_and_time(iteration, model, optimizer,
  File "/home/neko/Git/megatron-lm/megatron/training.py", line 717, in save_checkpoint_and_time
    save_checkpoint(iteration, model, optimizer, opt_param_scheduler)
  File "/home/neko/Git/megatron-lm/megatron/checkpointing.py", line 295, in save_checkpoint
    torch.save(state_dict, checkpoint_name)
  File "/usr/local/lib/python3.8/dist-packages/torch/serialization.py", line 443, in save
    _save(obj, opened_zipfile, pickle_module, pickle_protocol)
  File "/usr/local/lib/python3.8/dist-packages/torch/serialization.py", line 670, in _save
    zip_file.write_record(name, storage.data_ptr(), num_bytes)
KeyboardInterrupt
Traceback (most recent call last):
  File "/usr/local/bin/torchrun", line 33, in <module>
    sys.exit(load_entry_point('torch==2.0.0a0+1767026', 'console_scripts', 'torchrun')())
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/elastic/multiprocessing/errors/__init__.py", line 346, in wrapper
    return f(*args, **kwargs)
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/run.py", line 779, in main
    run(args)
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/run.py", line 770, in run
    elastic_launch(
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/launcher/api.py", line 134, in __call__
    return launch_agent(self._config, self._entrypoint, list(args))
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/launcher/api.py", line 241, in launch_agent
    result = agent.run()
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/elastic/metrics/api.py", line 129, in wrapper
    result = f(*args, **kwargs)
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/elastic/agent/server/api.py", line 723, in run
    result = self._invoke_run(role)
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/elastic/agent/server/api.py", line 864, in _invoke_run
    time.sleep(monitor_interval)
  File "/usr/local/lib/python3.8/dist-packages/torch/distributed/elastic/multiprocessing/api.py", line 62, in _terminate_process_handler
    raise SignalException(f"Process {os.getpid()} got signal: {sigval}", sigval=sigval)
torch.distributed.elastic.multiprocessing.api.SignalException: Process 5836 got signal: 2
```

为了能恢复训练，我们需要 checkpoints，而 checkpoints 的保存依赖两个参数：`--save` 和 `--save-interval`。

- `--save` 表示 checkpoint 存储在什么路径
- `--save-interval` 表示每过多少次训练迭代次数（iteration）保存一次

想要恢复训练，也要确保 `--load` 参数是配置正确的，它将会从 `--save` 参数配置的路径下的名为 `latest_checkpointed_iteration.txt` 读取最后一次的训练迭代次数（iteration）的编号，并且读取 `--save` 参数配置的路径下的形如 `iter_0000004` 的 checkpoint 文件读取并恢复先前的训练进度。

> [!WARNING]
> 需要注意的是，如果在训练的过程中修改了并行训练的时候会使用到的 `--tensor-model-parallel-size` 参数和 `--pipeline-model-parallel-size` 参数，checkpoint 的结构将会发生变化，这个时候先前的 checkpoint 将不会被 Megatron 所接受，需要整个推翻重新训练才行了。

:::

想要重新恢复，直接执行之前的脚本就好了：

```shell
./train.sh
Zarr-based strategies will not be registered because of missing packages
using world size: 1, data-parallel size: 1, context-parallel size: 1 tensor-model-parallel size: 1, pipeline-model-parallel size: 1
WARNING: Setting args.overlap_p2p_comm to False since non-interleaved schedule does not support overlapping p2p communication
using torch.float16 for parameters ...

# ...
# 中间省略超级多内容
# ...

> learning rate decay style: cosine
 loading checkpoint from ./checkpoints/gpt-2 at iteration 3
 checkpoint version 3.0
 > using checkpoint value 0.00015 for learning rate
 > using checkpoint value 1e-05 for minimum learning rate
 > using checkpoint value 25600.0 for warmup iterations
 > using checkpoint value 2560000 for total number of iterations
 > using checkpoint value cosine for learning rate decay style
 > using checkpoint value 0.01 for start weight decay
 > using checkpoint value 0.01 for end weight decay
 > using checkpoint value 8000 for total number of weight decay iterations
 > using checkpoint value constant for weight decay incr style
  successfully loaded checkpoint from ./checkpoints/gpt-2 at iteration 3
/usr/local/lib/python3.8/dist-packages/torch/distributed/distributed_c10d.py:2533: UserWarning: torch.distributed._all_gather_base is a private function and will be deprecated. Please use torch.distributed.all_gather_into_tensor instead.
  warnings.warn(
(min, max) time across ranks (ms):
    load-checkpoint ................................: (2086.04, 2086.04)
[after model, optimizer, and learning rate scheduler are built] datetime: 2024-01-24 11:13:33
> building train, validation, and test datasets ...
 > datasets target sizes (minimum size):
    train:      8000
    validation: 80080
    test:       80
> building train, validation, and test datasets for GPT ...
INFO:megatron.core.datasets.blended_megatron_dataset_config:Let split_matrix = [(0, 0.949), (0.949, 0.999), (0.999, 1.0)]
INFO:megatron.core.datasets.indexed_dataset:Load the _IndexReader from ./data/meg-gpt2_text_document.idx
INFO:megatron.core.datasets.indexed_dataset:    Extract the sequence lengths
INFO:megatron.core.datasets.indexed_dataset:    Extract the sequence pointers
INFO:megatron.core.datasets.indexed_dataset:    Extract the document indices
INFO:megatron.core.datasets.indexed_dataset:> total number of sequences: 79000
INFO:megatron.core.datasets.indexed_dataset:> total number of documents: 79000
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset train indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 743f9c78682483773343914511a6c2a5-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 743f9c78682483773343914511a6c2a5-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 743f9c78682483773343914511a6c2a5-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 216895
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 1
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset valid indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 81082
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 7
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset test indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 368
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 1
> finished creating GPT datasets ...
[after dataloaders are built] datetime: 2024-01-24 11:13:33
done with setup ...
(min, max) time across ranks (ms):
    model-and-optimizer-setup ......................: (2266.13, 2266.13)
    train/valid/test-data-iterators-setup ..........: (736.49, 736.49)
training ...
[before the start of training step] datetime: 2024-01-24 11:13:33
(min, max) time across ranks (ms):
    evaluate .......................................: (2113.54, 2113.54)
---------------------------------------------------------------------------------------------
 validation loss at iteration 4 | lm loss value: 1.102960E+01 | lm loss PPL: 6.167297E+04 |
---------------------------------------------------------------------------------------------
saving checkpoint at iteration       4 to ./checkpoints/gpt-2
```

::: details 完整的训练开始的时候的输出

```shell
./train.sh
Zarr-based strategies will not be registered because of missing packages
using world size: 1, data-parallel size: 1, context-parallel size: 1 tensor-model-parallel size: 1, pipeline-model-parallel size: 1
WARNING: Setting args.overlap_p2p_comm to False since non-interleaved schedule does not support overlapping p2p communication
using torch.float16 for parameters ...
------------------------ arguments ------------------------
  accumulate_allreduce_grads_in_fp32 .............. False
  adam_beta1 ...................................... 0.9
  adam_beta2 ...................................... 0.999
  adam_eps ........................................ 1e-08
  add_bias_linear ................................. True
  add_position_embedding .......................... True
  adlr_autoresume ................................. False
  adlr_autoresume_interval ........................ 1000
  apply_layernorm_1p .............................. False
  apply_query_key_layer_scaling ................... False
  apply_residual_connection_post_layernorm ........ False
  apply_rope_fusion ............................... True
  async_tensor_model_parallel_allreduce ........... True
  attention_dropout ............................... 0.1
  attention_softmax_in_fp32 ....................... False
  barrier_with_L1_time ............................ True
  bert_binary_head ................................ True
  bert_embedder_type .............................. megatron
  bert_load ....................................... None
  bf16 ............................................ False
  bias_dropout_fusion ............................. True
  bias_gelu_fusion ................................ True
  bias_swiglu_fusion .............................. True
  biencoder_projection_dim ........................ 0
  biencoder_shared_query_context_model ............ False
  block_data_path ................................. None
  check_for_nan_in_loss_and_grad .................. True
  classes_fraction ................................ 1.0
  clip_grad ....................................... 1.0
  clone_scatter_output_in_embedding ............... True
  consumed_train_samples .......................... 0
  consumed_valid_samples .......................... 0
  context_parallel_size ........................... 1
  data_cache_path ................................. None
  data_parallel_random_init ....................... False
  data_parallel_size .............................. 1
  data_path ....................................... ['./data/meg-gpt2_text_document']
  data_per_class_fraction ......................... 1.0
  data_sharding ................................... True
  dataloader_type ................................. single
  decoder_num_layers .............................. None
  decoder_seq_length .............................. None
  delay_grad_reduce ............................... True
  delay_param_gather .............................. False
  dino_bottleneck_size ............................ 256
  dino_freeze_last_layer .......................... 1
  dino_head_hidden_size ........................... 2048
  dino_local_crops_number ......................... 10
  dino_local_img_size ............................. 96
  dino_norm_last_layer ............................ False
  dino_teacher_temp ............................... 0.07
  dino_warmup_teacher_temp ........................ 0.04
  dino_warmup_teacher_temp_epochs ................. 30
  distribute_saved_activations .................... False
  distributed_backend ............................. nccl
  distributed_timeout_minutes ..................... 10
  embedding_path .................................. None
  empty_unused_memory_level ....................... 0
  encoder_num_layers .............................. 24
  encoder_seq_length .............................. 1024
  end_weight_decay ................................ 0.01
  eod_mask_loss ................................... False
  eval_interval ................................... 1
  eval_iters ...................................... 10
  evidence_data_path .............................. None
  exit_duration_in_mins ........................... None
  exit_interval ................................... None
  exit_on_missing_checkpoint ...................... False
  exit_signal_handler ............................. False
  expert_model_parallel_size ...................... 1
  ffn_hidden_size ................................. 4096
  finetune ........................................ False
  fp16 ............................................ True
  fp16_lm_cross_entropy ........................... False
  fp32_residual_connection ........................ False
  fp8 ............................................. None
  fp8_amax_compute_algo ........................... most_recent
  fp8_amax_history_len ............................ 1
  fp8_interval .................................... 1
  fp8_margin ...................................... 0
  fp8_wgrad ....................................... True
  global_batch_size ............................... 8
  gradient_accumulation_fusion .................... True
  group_query_attention ........................... False
  head_lr_mult .................................... 1.0
  hidden_dropout .................................. 0.1
  hidden_size ..................................... 1024
  hysteresis ...................................... 2
  ict_head_size ................................... None
  ict_load ........................................ None
  img_h ........................................... 224
  img_w ........................................... 224
  indexer_batch_size .............................. 128
  indexer_log_interval ............................ 1000
  inference_batch_times_seqlen_threshold .......... 512
  init_method_std ................................. 0.02
  init_method_xavier_uniform ...................... False
  initial_loss_scale .............................. 4294967296
  iter_per_epoch .................................. 1250
  kv_channels ..................................... 64
  lazy_mpu_init ................................... None
  load ............................................ ./checkpoints/gpt-2
  local_rank ...................................... None
  log_batch_size_to_tensorboard ................... False
  log_interval .................................... 10
  log_learning_rate_to_tensorboard ................ True
  log_loss_scale_to_tensorboard ................... True
  log_memory_to_tensorboard ....................... False
  log_num_zeros_in_grad ........................... False
  log_params_norm ................................. False
  log_throughput .................................. False
  log_timers_to_tensorboard ....................... False
  log_validation_ppl_to_tensorboard ............... False
  log_world_size_to_tensorboard ................... False
  loss_scale ...................................... None
  loss_scale_window ............................... 1000
  lr .............................................. 0.00015
  lr_decay_iters .................................. 320000
  lr_decay_samples ................................ None
  lr_decay_style .................................. cosine
  lr_warmup_fraction .............................. 0.01
  lr_warmup_init .................................. 0.0
  lr_warmup_iters ................................. 0
  lr_warmup_samples ............................... 0
  make_vocab_size_divisible_by .................... 128
  manual_gc ....................................... False
  manual_gc_eval .................................. True
  manual_gc_interval .............................. 0
  mask_factor ..................................... 1.0
  mask_prob ....................................... 0.15
  mask_type ....................................... random
  masked_softmax_fusion ........................... True
  max_position_embeddings ......................... 1024
  max_tokens_to_oom ............................... 12000
  merge_file ...................................... ./data/gpt2-merges.txt
  micro_batch_size ................................ 4
  min_loss_scale .................................. 1.0
  min_lr .......................................... 1e-05
  moe_grouped_gemm ................................ False
  nccl_communicator_config_path ................... None
  no_load_optim ................................... None
  no_load_rng ..................................... None
  no_persist_layer_norm ........................... False
  no_save_optim ................................... None
  no_save_rng ..................................... None
  norm_epsilon .................................... 1e-05
  normalization ................................... LayerNorm
  num_attention_heads ............................. 16
  num_channels .................................... 3
  num_classes ..................................... 1000
  num_experts ..................................... None
  num_layers ...................................... 24
  num_layers_per_virtual_pipeline_stage ........... None
  num_query_groups ................................ 1
  num_workers ..................................... 2
  onnx_safe ....................................... None
  openai_gelu ..................................... False
  optimizer ....................................... adam
  output_bert_embeddings .......................... False
  overlap_grad_reduce ............................. False
  overlap_p2p_comm ................................ False
  overlap_param_gather ............................ False
  override_opt_param_scheduler .................... False
  params_dtype .................................... torch.float16
  patch_dim ....................................... 16
  perform_initialization .......................... True
  pipeline_model_parallel_size .................... 1
  pipeline_model_parallel_split_rank .............. None
  position_embedding_type ......................... learned_absolute
  profile ......................................... False
  profile_ranks ................................... [0]
  profile_step_end ................................ 12
  profile_step_start .............................. 10
  query_in_block_prob ............................. 0.1
  rampup_batch_size ............................... None
  rank ............................................ 0
  recompute_granularity ........................... selective
  recompute_method ................................ None
  recompute_num_layers ............................ None
  reset_attention_mask ............................ False
  reset_position_ids .............................. False
  retriever_report_topk_accuracies ................ []
  retriever_score_scaling ......................... False
  retriever_seq_length ............................ 256
  retro_add_retriever ............................. False
  retro_attention_gate ............................ 1
  retro_cyclic_train_iters ........................ None
  retro_encoder_attention_dropout ................. 0.1
  retro_encoder_hidden_dropout .................... 0.1
  retro_encoder_layers ............................ 2
  retro_num_neighbors ............................. 2
  retro_num_retrieved_chunks ...................... 2
  retro_return_doc_ids ............................ False
  retro_verify_neighbor_count ..................... True
  retro_workdir ................................... None
  rotary_percent .................................. 1.0
  rotary_seq_len_interpolation_factor ............. None
  sample_rate ..................................... 1.0
  save ............................................ ./checkpoints/gpt-2
  save_interval ................................... 1
  scatter_gather_tensors_in_pipeline .............. True
  seed ............................................ 1234
  seq_length ...................................... 1024
  sequence_parallel ............................... False
  sgd_momentum .................................... 0.9
  short_seq_prob .................................. 0.1
  skip_train ...................................... False
  spec ............................................ None
  split ........................................... 949,50,1
  squared_relu .................................... False
  standalone_embedding_stage ...................... False
  start_weight_decay .............................. 0.01
  swiglu .......................................... False
  swin_backbone_type .............................. tiny
  tensor_model_parallel_size ...................... 1
  tensorboard_dir ................................. None
  tensorboard_log_interval ........................ 1
  tensorboard_queue_size .......................... 1000
  test_data_path .................................. None
  timing_log_level ................................ 0
  timing_log_option ............................... minmax
  titles_data_path ................................ None
  tokenizer_model ................................. None
  tokenizer_type .................................. GPT2BPETokenizer
  tp_comm_bulk_dgrad .............................. True
  tp_comm_bulk_wgrad .............................. True
  tp_comm_overlap ................................. False
  tp_comm_overlap_cfg ............................. None
  tp_comm_split_ag ................................ True
  tp_comm_split_rs ................................ True
  train_data_path ................................. None
  train_iters ..................................... 1000
  train_samples ................................... None
  transformer_impl ................................ local
  transformer_pipeline_model_parallel_size ........ 1
  untie_embeddings_and_output_weights ............. False
  use_checkpoint_args ............................. False
  use_checkpoint_opt_param_scheduler .............. False
  use_cpu_initialization .......................... None
  use_distributed_optimizer ....................... False
  use_flash_attn .................................. False
  use_mcore_models ................................ False
  use_one_sent_docs ............................... False
  use_ring_exchange_p2p ........................... False
  use_rotary_position_embeddings .................. False
  valid_data_path ................................. None
  variable_seq_lengths ............................ False
  virtual_pipeline_model_parallel_size ............ None
  vision_backbone_type ............................ vit
  vision_pretraining .............................. False
  vision_pretraining_type ......................... classify
  vocab_extra_ids ................................. 0
  vocab_file ...................................... ./data/gpt2-vocab.json
  vocab_size ...................................... None
  wandb_exp_name ..................................
  wandb_project ...................................
  wandb_save_dir ..................................
  weight_decay .................................... 0.01
  weight_decay_incr_style ......................... constant
  world_size ...................................... 1
-------------------- end of arguments ---------------------
setting number of micro-batches to constant 2
> building GPT2BPETokenizer tokenizer ...
 > padded vocab (size: 50257) with 47 dummy tokens (new size: 50304)
> initializing torch distributed ...
> initialized tensor model parallel with size 1
> initialized pipeline model parallel with size 1
> setting random seeds to 1234 ...
> compiling dataset index builder ...
make: Entering directory '/home/neko/Git/megatron-lm/megatron/core/datasets'
make: Nothing to be done for 'default'.
make: Leaving directory '/home/neko/Git/megatron-lm/megatron/core/datasets'
>>> done with dataset index builder. Compilation time: 0.127 seconds
> compiling and loading fused kernels ...
>>> done with compiling and loading fused kernels. Compilation time: 0.993 seconds
time to initialize megatron (seconds): 2.681
[after megatron is initialized] datetime: 2024-01-24 11:13:30
building GPT model ...
 > number of parameters on (tensor, pipeline) model parallel rank (0, 0): 354871296
INFO:megatron.core.distributed.grad_buffer:Number of buckets for gradient all-reduce / reduce-scatter: 1
INFO:megatron.core.distributed.grad_buffer:Params for bucket 1 (354871296 elements):
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.final_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.embedding.position_embeddings.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.final_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.4.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.23.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.input_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.5.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.0.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.self_attention.dense.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.9.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.6.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.embedding.word_embeddings.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.self_attention.query_key_value.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.self_attention.query_key_value.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.13.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.10.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.1.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.20.mlp.dense_4h_to_h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.17.mlp.dense_4h_to_h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.14.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.11.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.8.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.21.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.18.post_attention_norm.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.15.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.12.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.2.mlp.dense_h_to_4h.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.22.post_attention_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.19.mlp.dense_h_to_4h.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.16.self_attention.dense.bias
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.7.input_norm.weight
INFO:megatron.core.distributed.grad_buffer:    module.language_model.encoder.layers.3.post_attention_norm.weight
> learning rate decay style: cosine
 loading checkpoint from ./checkpoints/gpt-2 at iteration 3
 checkpoint version 3.0
 > using checkpoint value 0.00015 for learning rate
 > using checkpoint value 1e-05 for minimum learning rate
 > using checkpoint value 25600.0 for warmup iterations
 > using checkpoint value 2560000 for total number of iterations
 > using checkpoint value cosine for learning rate decay style
 > using checkpoint value 0.01 for start weight decay
 > using checkpoint value 0.01 for end weight decay
 > using checkpoint value 8000 for total number of weight decay iterations
 > using checkpoint value constant for weight decay incr style
  successfully loaded checkpoint from ./checkpoints/gpt-2 at iteration 3
/usr/local/lib/python3.8/dist-packages/torch/distributed/distributed_c10d.py:2533: UserWarning: torch.distributed._all_gather_base is a private function and will be deprecated. Please use torch.distributed.all_gather_into_tensor instead.
  warnings.warn(
(min, max) time across ranks (ms):
    load-checkpoint ................................: (2086.04, 2086.04)
[after model, optimizer, and learning rate scheduler are built] datetime: 2024-01-24 11:13:33
> building train, validation, and test datasets ...
 > datasets target sizes (minimum size):
    train:      8000
    validation: 80080
    test:       80
> building train, validation, and test datasets for GPT ...
INFO:megatron.core.datasets.blended_megatron_dataset_config:Let split_matrix = [(0, 0.949), (0.949, 0.999), (0.999, 1.0)]
INFO:megatron.core.datasets.indexed_dataset:Load the _IndexReader from ./data/meg-gpt2_text_document.idx
INFO:megatron.core.datasets.indexed_dataset:    Extract the sequence lengths
INFO:megatron.core.datasets.indexed_dataset:    Extract the sequence pointers
INFO:megatron.core.datasets.indexed_dataset:    Extract the document indices
INFO:megatron.core.datasets.indexed_dataset:> total number of sequences: 79000
INFO:megatron.core.datasets.indexed_dataset:> total number of documents: 79000
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset train indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 743f9c78682483773343914511a6c2a5-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 743f9c78682483773343914511a6c2a5-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 743f9c78682483773343914511a6c2a5-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 216895
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 1
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset valid indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 5c58c96640514eacb357eae3e1bd7c1d-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 81082
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 7
INFO:megatron.core.datasets.gpt_dataset:Load the GPTDataset test indices
INFO:megatron.core.datasets.gpt_dataset:        Load the document index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-document_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the sample index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-sample_index.npy
INFO:megatron.core.datasets.gpt_dataset:        Load the shuffle index from 4422b241e58c2eba0e87abb1077559e9-GPTDataset-shuffle_index.npy
INFO:megatron.core.datasets.gpt_dataset:> total number of samples: 368
INFO:megatron.core.datasets.gpt_dataset:> total number of epochs: 1
> finished creating GPT datasets ...
[after dataloaders are built] datetime: 2024-01-24 11:13:33
done with setup ...
(min, max) time across ranks (ms):
    model-and-optimizer-setup ......................: (2266.13, 2266.13)
    train/valid/test-data-iterators-setup ..........: (736.49, 736.49)
training ...
[before the start of training step] datetime: 2024-01-24 11:13:33
(min, max) time across ranks (ms):
    evaluate .......................................: (2113.54, 2113.54)
---------------------------------------------------------------------------------------------
 validation loss at iteration 4 | lm loss value: 1.102960E+01 | lm loss PPL: 6.167297E+04 |
---------------------------------------------------------------------------------------------
saving checkpoint at iteration       4 to ./checkpoints/gpt-2
```

:::

## 参考资料

[如何训练 GPT-2 模型并生成文本 云服务器 ECS（ECS） - 阿里云帮助中心](https://help.aliyun.com/zh/ecs/use-cases/use-the-megatron-deepspeed-training-gpt-2-and-generate-text)
