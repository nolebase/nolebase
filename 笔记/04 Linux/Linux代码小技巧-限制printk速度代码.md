---
share: "true"
---
# printk速率限制

> 使用`printk_ratelimit()`可以限制打印速率，但是需要在文件系统中配置参数才可生效。
>
> 使用`printk_timed_ratelimit()`虽然可以不需要修改文件系统配置就可以限制打印速率，但其代码超过两段，比较麻烦。

# 自定义

## 示例1

```c
static struct mutex timed_print_mutex;
#define PRINT_GAP	30000 //30s

/*
printk("enter bq4050_timed_print, bool=%d,prev_jiffy=%lu,jiffies=%lu,out=%lu,until=%d,HZ=%d,3.3ms*%d\n", \
			__func__##__LINE__##printed,\
			prev_jiffy,\
			jiffies,\
			prev_jiffy+(unsigned long)(DIV_ROUND_UP( HZ*ms, 1000)),\
			time_after(jiffies,prev_jiffy+(unsigned long)(DIV_ROUND_UP( HZ*ms, 1000))),\
			HZ,\
			DIV_ROUND_UP( HZ*ms, 1000));\
*/
#define bq4050_timed_print( ms, fmt, arg...) \
{\
	static unsigned long __func__##__LINE__##prev_jiffy=0;\
	static bool __func__##__LINE__##printed=false;\
	mutex_lock(&timed_print_mutex);\
	__func__##__LINE__##prev_jiffy=(!__func__##__LINE__##prev_jiffy)?jiffies:__func__##__LINE__##prev_jiffy;\
	if( time_after(jiffies,__func__##__LINE__##prev_jiffy+(unsigned long)(DIV_ROUND_UP( HZ*ms, 1000))))\
		__func__##__LINE__##printed=false;\
	if( !__func__##__LINE__##printed)\
	{	\
		printk( fmt, ##arg);\
		__func__##__LINE__##printed=true;\
		__func__##__LINE__##prev_jiffy=jiffies;\
	}\
	mutex_unlock(&timed_print_mutex);\
}
```

## 示例2

```c
#define bq4050_timed2_print( ms, fmt, arg...) \
{\
	static unsigned long __func__##__LINE__##prev_jiffy=0;\
	if( printk_timed_ratelimit( &__func__##__LINE__##prev_jiffy, ms))\
		printk( fmt, ##arg);\
}
```

&emsp;&emsp;以上两种方法，第一种测试过，实际可以正常使用，第二种理论可行。