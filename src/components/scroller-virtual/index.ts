let currentScrollTop = -1;
type VirtualScrollProps = {
  renderItem: (idx: number) => string;
  itemCount: number;
  viewportHeight: number;
  rowHeight: number;
  nodePadding: number;
  scrollTop: number;
};
type VirtualScrollType = (payload: VirtualScrollProps) => string;
const VirtualScroll: VirtualScrollType = ({
  renderItem,
  itemCount,
  viewportHeight,
  rowHeight,
  nodePadding,
  scrollTop,
}: VirtualScrollProps) => {
  const totalContentHeight = itemCount * rowHeight;

  let startNode = Math.floor(scrollTop / rowHeight) - nodePadding;
  startNode = Math.max(0, startNode);

  //
  currentScrollTop = scrollTop;
  //

  let visibleNodesCount = Math.ceil(viewportHeight / rowHeight) + 2 * nodePadding;
  visibleNodesCount = Math.min(itemCount - startNode, visibleNodesCount);

  const offsetY = startNode * rowHeight;

  const visibleChildren = new Array(visibleNodesCount)
    .fill(null)
    .map((_, index) => renderItem(index + startNode));
  return `
    <div aria-role="listbox">
      <div
        style="
          height: ${totalContentHeight}px;
          overflow: hidden;
          position: relative;
          will-change: transform;
        "
      >
        <div
          class="result-list"
          tabindex="0"
          style="
            transform: translateY(${offsetY}px);
          "
        >
          ${visibleChildren.join("")}
        </div>
      </div>
    </div>`;
};

const container: HTMLElement | null = document.getElementById("container");

const renderItem = (idx: string) => {
  return `<li class="item" role="option" id="${getResultItemId(
    idx
  )}" tabindex="-1" style="height: 50px">Item ${idx}</li>`;
};

const getResultItemId = (idx: string | number) => `result-item-${idx}`;

const itemCount = 500;
const rowHeight = 50;
const nodePadding = 2;
const numItemsVisible = 6;

const options: VirtualScrollProps = {
  renderItem: (idx: number) => renderItem(idx.toString()), // Update the type of the renderItem function parameter to number
  itemCount,
  viewportHeight: container?.offsetHeight ?? 30,
  rowHeight,
  nodePadding,
  scrollTop: container?.scrollTop ?? 0,
};

const renderWindow = (p0?: boolean) => {
  const result = VirtualScroll(options);
  if (container) {
    container.innerHTML = result;
    if (activeIndex >= 0) {
      activeItem = document.getElementById(getResultItemId(activeIndex));
      if (activeItem) {
        activeItem.classList.add("focused");
        activeItem.scrollIntoView();
      }
    }
  }
};

renderWindow();

let animationFrame: number;

if (container) {
  container.addEventListener("scroll", (e) => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(() => {
      options.scrollTop = (e.target as HTMLElement)?.scrollTop ?? 0;
      renderWindow(true);
    });
  });
}

const searchInput: HTMLElement | null = document.querySelector(".search-input");
if (searchInput) {
  searchInput.addEventListener("focus", (e) => {
    activeIndex = -1;
  });

  searchInput.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowDown":
      case "ArrowUp":
      case "Escape":
        e.preventDefault();
        setActiveItem(e.code);
    }
  });
}
let activeIndex = -1;
let activeItem: HTMLElement | null = null;

const setActiveItem = (keyCode: string) => {
  switch (keyCode) {
    case "ArrowDown":
      activeIndex++;
      break;
    case "ArrowUp":
      activeIndex--;
      break;
    default:
      return;
  }
  if (activeIndex < 0) {
    activeIndex = itemCount - 1;
    options.scrollTop = (itemCount - (numItemsVisible + nodePadding)) * rowHeight;
    renderWindow();
  }
  if (activeIndex > itemCount - 1) {
    activeIndex = 0;
    options.scrollTop = 0;
    renderWindow();
  }
  if (activeItem) {
    activeItem.classList.remove("focused");
  }
  activeItem = document.getElementById(getResultItemId(activeIndex));
  console.log(activeItem);
  if (!activeItem) {
    options.scrollTop = getScrollTop(activeIndex);
    renderWindow();
    return;
  }

  if (activeItem) {
    activeItem.classList.add("focused");
  }

  const activeOffsetY = activeIndex * rowHeight;
  const maxVisibleItemsOffset = currentScrollTop + numItemsVisible * rowHeight;

  const isVisible =
    activeOffsetY >= currentScrollTop && activeOffsetY < maxVisibleItemsOffset;
  if (!isVisible && activeItem) {
    activeItem.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
  }
};

const getScrollTop = (idx: number) => {
  return idx * rowHeight;
};
