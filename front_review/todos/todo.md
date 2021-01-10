### 每天todo

###  2020
>6.1
1. React视频在理解一遍[学习了]
2. 算法课学习[未学习]

> 6.2
1. React视频在理解一遍[学习力]
2. 算法课学习[未学习]

> 6.3
1. React视频在理解一遍
2. 算法课学习[9-5]
3. 0.5道算法题
[303区域和检索](https://leetcode.com/problems/range-sum-query-immutable/)
方法:
- 线段树
- 预处理: sum[i]存储nums[0...i-1]的和； sum[0] = 0; 有一个数的偏移


[307]

> 6.4 (20天css专题)

1. css专题[完成html常见元素和理解]
2. 算法课学习 [完成][9-6] [9-7]
3. 0.5道算法题 编写 303问题 307问题 [完成303第一种解法]
```java
// 303
class NumArray {
    private int[] sum;
    public NumArray(int[] nums) {
        sum = new int[nums.length + 1]; // 多出一个位子存sum[0]
        sum[0] = 0;
        for(int i = 1; i <= nums.length; ++i){
            sum[i] = sum[i-1] + nums[i - 1];
        }
    }   
    public int sumRange(int i, int j) {
        return sum[j+1] - sum[i];
    }
}
```

> 6.5
1. css 基础[3-1~3-5] 
2. 算法课学习[trie 10-1, 10-2] [完成]
3. 0.5道算法题 303问题 线段树编写, 307问题 delay

 
> 6.6
1. react 性能优化[React实战进阶45讲]完成 4-1

> 6.7 
1. react 性能优化 [done]
2. 0.5道算法题 303问题 线段树编写 [done], 307问题
3. css 基础 [3-6~3-7][done]

> 6.8
1. css基础[4-1~4-5] [done]
2. 算法学习[10-3~10-4] [delay]
3. 0.5道算法题 307问题  [delay]

> 6.9
1. css基础[第5章 5-1][done]
2. 算法学习[10-3~10-4] 
3. 0.5道算法题 307问题

> 6.10 - 6.12 break

> 6.13
1. 完成trie树的学习 [done]
2. 完成208[done] 算法编写[211 677 307]  
3. css学习一点[done], 然后axios[not~done]

> 6.14 
1. 完成算法 307[done] 211
2. 学习并查集 [done]
3. css 3d demo [done] 性能不是太好, 然后axios[done]

> 6.15
1. 完成算法 211[not-done]
2. 学习并查集[not-done]
3. css 3d[not~done], axios example[done], 下一步学习webpack打包工具

> 6.16 ~ 6.17 break

> 6.18
1. axios buildURL[done]

> 6.19 

> 6.20 
1. axios 第五章[done]

> 6.21
1. axios 第六章[done]
2. 算法 211[done]
3. Union Find(第一版)[done]

> 6.22
1. axios 第七章[done]

> 6.24
css margin学习


> 7.4

css margin 学习[done]

> 7.5

css 学习