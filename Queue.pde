//////////
// Queue
//////////
public class Queue<T> {
  private ArrayList<T> items;

  public Queue() {
    items = new ArrayList<T>();
  }

  public void add(T i) {
    items.add(i);
  }

  public T peek() {
    return items.get(0);
  }

  public T remove() {
    T item = items.get(0);
    items.remove(0);
    return item;
  }

  public boolean isEmpty() {
    return items.isEmpty();
  }

  public int size() {
    return items.size();
  }

  public void clear() {
    items.clear();
  }
}
