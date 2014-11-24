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
  
  //
  private Node root;

  private NodeIterator cachedIterator;
  private boolean isDirty;

  /////////
  // Node
  /////////
  private class Node {
    private Key k;
    private Val v;
    private Node left, right;
    private Node parent;

    public Node(Key k, Val v) {
      this.k = k;
      this.v = v;
      left = null;
      right = null;
      parent = null;
    }
  }

  /////////////////
  // NodeIterator
  /////////////////
  private class NodeIterator implements Iterator<Val> {
    int index;
    Node current;

    // NodeIterator
    NodeIterator(Node n){
      index = 0;
      reset(n);
    }

    void reset(Node n){
      current = n;

      while(current.left != null){
        current = current.left;
      }
    }

    public boolean hasNext(){
      return current != null;
    }

    public Val next(){

      Node temp = current;

      if(current.right != null){
        current = current.right;

        // go all the way left.
        while(current.left != null){
          current = current.left;
        }
      }
      else{
        //
        while(true){
          if(current.parent == null){
            current = null;
            return temp.v;
          }
          //
          if(current.parent.left == current){
            current = current.parent;
            return temp.v;
          }
          current = current.parent;
        }
      }
      return temp.v;
    }
  }

  // BinaryTree
  public BinaryTree(){
    root = null;
    isDirty = true;
    cachedIterator = null;
  }

  public boolean isEmpty(){
    return root == null;
  }

  //
  public void put(Key k, Val v) {
    root = put(root, k, v);
    isDirty = true;
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
    isDirty = true;

    if (r == null) {
      return new Node(k, v);
    }

    int cmp = k.compareTo(r.k);

    if (cmp < 0) {
      r.left = put(r.left, k, v);
      r.left.parent = r;
    }
    else if (cmp > 0) {
      r.right = put(r.right, k, v);
      r.right.parent = r;
    }
    else {
      println("?????");
    }
    return r;
  }

  // implementing Iterable
  public Iterator<Val> iterator(){
    
    if(cachedIterator == null || isDirty){
      cachedIterator = new NodeIterator(root);
      isDirty = false;
      return cachedIterator;
    }
    else{
      cachedIterator.reset(root);
      return cachedIterator;  
    }
  }
}
