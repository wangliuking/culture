package run.controller;

import run.bean.Node;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class TreeUtil {

    // 入口方法
    public List<Node> getInfiniteLevelTree(List<Node> nodeList,int id) {
        List<Node> list = new ArrayList<>();
        // 遍历节点列表
        for (Node node : nodeList) {
            if (node.getId() == id) {
                // parentID为-1（根节点）作为入口
                node.setChildren(getChildrenNode(node.getId(), nodeList));
                list.add(node);
            }
        }
        // 排序
        //list.sort(new NodeOrderComparator());
        return list;
    }

    // 获取子节点的递归方法
    public List<Node> getChildrenNode(int id, List<Node> nodeList) {
        List<Node> lists = new ArrayList<>();
        for (Node node : nodeList) {
            if (node.getpId() == id) {
                // 递归获取子节点
                node.setChildren(getChildrenNode(node.getId(), nodeList));
                lists.add(node);
            }
        }
        // 排序
        //lists.sort(new NodeOrderComparator());
        return lists;
    }
}
