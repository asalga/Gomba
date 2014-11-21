///////////////
// Comparable
///////////////
public interface Comparable <T> {
  int compareTo(Object obj);
}

public interface Iterator<T> {
  boolean hasNext();
  T next();
}

public interface Iterable{
  Iterator iterator();
}

///////////////
// BinaryTree
///////////////
public class BinaryTree<Key extends Comparable, Val> implements Iterable{
  private Node root;

  /////////
  // Node
  /////////
  private class Node {
    private Key k;
    private Val v;
    private Node left, right;

    public Node(Key k, Val v) {
      this.k = k;
      this.v = v;
    }
  }

  /////////////////
  // NodeIterator
  /////////////////
  private class NodeIterator implements Iterator<Val> {
    int index;
    ArrayList<Val> values;

    NodeIterator(Node n){
      index = 0;
      values = new ArrayList<Val>();
      insertInOrder(n);
    }

    public boolean hasNext(){
      return index < values.size();
    }

    public Val next(){
      Val v = values.get(index);
      index++;
      return v;
    }

    private void insertInOrder(Node root){
      if(root.left != null){
        insertInOrder(root.left);
      }
      
      values.add(root.v);

      if(root.right != null){
        insertInOrder(root.right);
      }
    }
  }

  public boolean isEmpty(){
    return root == null;
  }

  //
  public void put(Key k, Val v) {
    root = put(root, k, v);
  }

  public Val get(Key k) {
    return get(root, k);
  }

  private Val get(Node n, Key k) {
    if (n == null) return null;

    int cmp = k.compareTo(n.k);
    if (cmp < 0) { 
      return get(n.left, k);
    }
    else if (cmp > 0) {
      return get(n.right, k);
    }
    else return n.v;
  }

  private Node put(Node r, Key k, Val v) {

    if (r == null) {
      return new Node(k, v);
    }

    int cmp = k.compareTo(r.k);

    if (cmp < 0) {
      r.left = put(r.left, k, v);
    }
    else if (cmp > 0) {
      r.right = put(r.right, k, v);
    }
    else {
      println("?????");
    }
    return r;
  }

  // implementing Iterable
  public Iterator<Val> iterator() {
    return new NodeIterator(root);
  }
}
