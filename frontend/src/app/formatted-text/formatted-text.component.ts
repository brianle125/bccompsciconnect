import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Queue } from '@datastructures-js/queue';
import { marked } from 'marked';

// https://stackoverflow.com/questions/44939878/dynamically-adding-and-removing-components-in-angular

@Component({
  selector: 'app-formatted-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formatted-text.component.html',
  styleUrl: './formatted-text.component.css'
})
export class FormattedTextComponent {
  @Input() text: string = ''
  public compiled: string = '' 

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if(changes['text'] != undefined) {
      console.log('before', this.text)
      let div: HTMLDivElement = document.createElement('div')
      div.innerHTML = this.text
      this.editDOM(div).finally(()=> {
        console.log('result', div.innerHTML)
        this.compiled = div.innerHTML
      })
    }
  }

  private nodeToString(node: ChildNode): string {
    let temp = document.createElement("div")
    node.childNodes.forEach((child) => {
      temp.appendChild(child)
    })
    return temp.innerHTML
  }

  private async editDOM(node: ChildNode): Promise<void> {
    // breath first traversal
    let exploreNext: Queue<DOMTraverseNode> = new Queue()
    exploreNext.push(new DOMTraverseNode(node, 0, false))

    while (!exploreNext.isEmpty()) {
      let currentNode: DOMTraverseNode = exploreNext.pop()
      // this.removeBannedTags(currentNode.node)
      console.log(currentNode)
      // node's children haven't been accessed yet so editing node's children is fine
      let visitChildren: boolean = true
      if(currentNode.node.nodeName == 'MARKDOWN') {
        let asHTML: HTMLElement = currentNode.node as HTMLElement
        console.log('str', asHTML.innerHTML);
        let compiledMarkdown: string = await marked(this.nodeToString(currentNode.node));
        asHTML.innerHTML = compiledMarkdown
        console.log('md', compiledMarkdown)
        visitChildren = false
      }
      
      if(visitChildren) {
        currentNode.node.childNodes.forEach((node) => {
          if(currentNode.depth < 10) {
            // let allowHTML: boolean = currentNode.htmlAllowed
            // if(this.isHTMLAllowedTag(currentNode.node.nodeName)) {
            //   allowHTML = true
            // }
            console.log('child', node)
            exploreNext.push(new DOMTraverseNode(node, currentNode.depth + 1, false))
          }
        })
      }
      
    }
  }

  constructor() {

  }
}

class DOMTraverseNode {
  constructor(
    public node: ChildNode,
    public depth: number,
    public htmlAllowed: boolean
  ) { }
  
}