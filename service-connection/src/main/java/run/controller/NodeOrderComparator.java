package run.controller;

import run.bean.Node;

public class NodeOrderComparator {
    // 按照节点排序值进行排序
    public int compare(Node n1, Node n2) {
        return (n1.getLevel() < n2.getLevel() ? -1 : (n1.getLevel() == n2.getLevel() ? 0 : 1));
    }
}
