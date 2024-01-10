---

title: 05 TreeMap

---

## 1、TreeMap 的特点
* treemap 是一个双列集合，map的子类，底层有红黑树构成
* 特点
    元素中的健不能重复
    元素会按照大小顺序排序
## 2、TreeMap 的数据结构
### 2.1 二叉查找树

 **特点**
* 若左子树不为空，则左子树上的所有节点的值均小于它的根结点的值
* 若右子树不为空，。右。。。。。。。。。。。大于。。。。。。。
* 左右树也分别为二叉排序树
* 没有相等的节点

 **二叉查找树就是每个节点按照大小排列的二叉树，二叉查找树方便对节点的值进行查找**

![map01.png](/java/map01.png)

**查找方式**
从根结点开始查找，如果等于则返回
如果小于，则在左子书中递归查找
如果大于，则在右子树中递归查找

### 2.3 平衡二叉树

1.定义：
    为了避免出现“瘸子的现象”，减少树的高度，提高搜索效率，出现了平衡二叉树：**左右两个子树的高度差不超过1，并且左右两个树都是一颗平衡二叉树**

![map02.png](/java/map02.png)

2. 平衡二叉树的选装
* 左旋
右支往左拉，右支节点变为父节点，并把晋升之后多余的左子节（s左）点让给降级节点（E）的右子节点
![map03.png](/java/map03.png)

* 右旋
左支往右拉，左支节点变为父节点，并把晋升之后多余的右支节点(e右)让给降级节点的左子节点

![map04.png](/java/map04.png)

* 四种左右失衡的情况
![map06.png](/java/map06.png)
![map07.png](/java/map07.png)

### 2.4 红黑树

1. 概述
* 自平衡的二叉查找树
* 每个节点都有存储为表示节点的颜色，可以是红或者黑
* 红黑树不是高度平衡的，平衡是通过“红黑树的特性“进行实现的

2. 红黑树的特性
* 每一个节点是红色或者黑色
* 根结点必须是黑色
* 每个叶节点是黑色（叶节点是nil）
* 如果某一个节点是红色，那么它的子节点必须是黑色（不能出现两个红节点相连的情况）
* 每一个节点，从该结点到其所有后代叶结点的简单路径上，均包含相同数目的黑色结点

![map08.png](/java/map08.png)

### TreeMap.java
```java
public class TreeMap<K,V>
    extends AbstractMap<K,V>
    implements NavigableMap<K,V>, Cloneable, java.io.Serializable
{

    static final class Entry<K,V> implements Map.Entry<K,V> {
            K key;   // 键
            V value;  //值
            Entry<K,V> left;  //左子结点的地址
            Entry<K,V> right;  // 右子结点的地址
            Entry<K,V> parent;  // 父结点的地址
            boolean color = BLACK; // 结点的颜色
    }

    // get 方法
    public V get(Object key) {
        // 根据键获取entry的值
        Entry<K,V> p = getEntry(key);
        // 判断对象，如果是null 返回null，不是，返回对象中的值
        return (p==null ? null : p.value);
    }

    final Entry<K,V> getEntry(Object key) {
        // Offload comparator-based version for sake of performance
        // 判断有没有传入comparator
        if (comparator != null)
            // 调用此方法，使用比较器查询
            return getEntryUsingComparator(key);
        // 判断传入的键值是否为null
        if (key == null)
            // 如果传入的键值为null，则抛出空指针异常
            throw new NullPointerException();
        // 把Object的键向下转型为Comparable
        @SuppressWarnings("unchecked")
            Comparable<? super K> k = (Comparable<? super K>) key;
        // 先把二叉树的根结点复制非p
        Entry<K,V> p = root;
        // 如果p不null，一只循环比较
        while (p != null) {
            // 调用Comparable的compareTo方法进行比较
            int cmp = k.compareTo(p.key);
            // 如果cmp小于0，表示要查找的键小于结点的数字
            if (cmp < 0)
                // 把p左子结点值赋值给p对象
                p = p.left;
            else if (cmp > 0)
                p = p.right;
            else
                // 要查找的键等于结点的值，就把当前的entry对象返回
                return p;
        }
        // 已经找到叶子结点，没有查找到要找的数字，返回null
        return null;
    }
    // 使用比较器的情况
    final Entry<K,V> getEntryUsingComparator(Object key) {
        @SuppressWarnings("unchecked")
            K k = (K) key;
        Comparator<? super K> cpr = comparator;
        if (cpr != null) {
            Entry<K,V> p = root;
            while (p != null) {
                int cmp = cpr.compare(k, p.key);
                if (cmp < 0)
                    p = p.left;
                else if (cmp > 0)
                    p = p.right;
                else
                    return p;
            }
        }
        return null;
    }

}

```

**put方法**
```java
public V put(K key, V value) {
        // 获取根结点，赋值给变量t
        Entry<K,V> t = root;
        // 判断根结点是否为null
        if (t == null) {
            // 对key进行非空和类型校验
            compare(key, key); // type (and possibly null) check
            // 新建一个结点
            root = new Entry<>(key, value, null);
            // 设置集合的长度为1
            size = 1;
            //记录集合被修改的次数
            modCount++;
            //添加成功返回null
            return null;
        }
        // 如果根结点不是null，执行下面的代码
        int cmp;
        Entry<K,V> parent;
        // split comparator and comparable paths
        // 把比较器对象赋值给 cpr
        Comparator<? super K> cpr = comparator;
        // 判断比较器对象，如果是null，则执行以下代码
        if (cpr != null) {
            do {
                //把当前结点复制给变量parent
                parent = t;
                // 比较当前结点的键和要存储的键的大小
                cmp = cpr.compare(key, t.key);
                // 如果要存储的键小于当前结点，则继续和左边的结点进行比较
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else
                    // 如果等于0
                    return t.setValue(value);
            } while (t != null);
        }
        else {
            if (key == null)
                throw new NullPointerException();
            @SuppressWarnings("unchecked")
                Comparable<? super K> k = (Comparable<? super K>) key;
            do {
                parent = t;
                cmp = k.compareTo(t.key);
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else
                    return t.setValue(value);
            } while (t != null);
        }
        // 遍历结束，如果没有找到相同的键，则执行下面的代码
        // 新增的键和以前的键不相同，去创建结点
        // 创建新的结点对象，保存键值对，设置父结点
        Entry<K,V> e = new Entry<>(key, value, parent);
        if (cmp < 0)
            parent.left = e;
        else
            parent.right = e;
        // 进行二叉树的重平衡
        fixAfterInsertion(e);
        size++;
        modCount++;
        return null;
    }
```








