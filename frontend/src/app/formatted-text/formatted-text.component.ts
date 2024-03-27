import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input() text: string = `text<div>text</div>super <span>special</span> text <markdown>helpme <button></button></markdown> <button></button><a href="javascript:alert('Hello, world!')"></a>`

  

  // private HTMLAllowedTags: string[] = ['MARKDOWN']

  // private isJavascriptCode(code: string): boolean {
  //   try {
  //     new Function(code)
  //   } catch(e) {
  //     return false
  //   }
  //   return true
  // }

  // private removeBannedTags(node: ChildNode) {
  //   let toRemove: ChildNode[] = []
  //   node.childNodes.forEach((child) => {
  //     let name: string = child.nodeName
  //     if(name == 'SCRIPT' || name == 'BUTTON') {
  //       toRemove.push(child);
  //     }
  //     if(name == 'A') {
  //       let anchor: HTMLAnchorElement = node as unknown as HTMLAnchorElement
  //       if(this.isJavascriptCode(anchor.href)) {
  //         toRemove.push(child)
  //       }
  //     }
  //   })
  //   toRemove.forEach((remove) => {
  //     node.removeChild(remove)
  //   })
  // }

  // private HTMLNodesToText(node: ChildNode) {
  //   let originalNodes: ChildNode[] = []
  //   node.childNodes.forEach((child) => {
  //     originalNodes.push(child)
  //   })
  // }

  // private isHTMLAllowedTag(tag: string) {
  //   return this.HTMLAllowedTags.includes(tag)
  // }

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
      if(currentNode.node.nodeName == 'MARKDOWN') {
        let asHTML: HTMLElement = currentNode.node as HTMLElement
        console.log('str', asHTML.innerHTML);
        let compiledMarkdown: string = await marked(this.nodeToString(currentNode.node));
        asHTML.innerHTML = compiledMarkdown
        console.log('md', compiledMarkdown)
      }
      
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

  constructor() {
    // const clean = sanitizeHtml(this.text, this.sanitizeOptions)
    // sanitizeHtml.default(this.text, this.sanitizeOptions)
    console.log('clean')
    // let div: HTMLDivElement = document.createElement('div')
    // div.innerHTML = this.text
    // console.log(div.childNodes)
    // console.log(div)
    // div.childNodes.forEach((val) => {
    //   console.log(val.textContent, val.nodeName)
    // })

    // console.log('test')
    // this.editDOM(div).finally(()=> {
    //   console.log('result', div.innerHTML)
    //   console.log(document.createTextNode('<div></div>'))
    // })
    
    
  }
}

class DOMTraverseNode {
  constructor(
    public node: ChildNode,
    public depth: number,
    public htmlAllowed: boolean
  ) { }
  
}