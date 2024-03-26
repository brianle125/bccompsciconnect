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
  @Input() text: string = `text<div>text</div>super <span>special</span> text <markdown>helpme</markdown>`


  private nodeToString(node: ChildNode): string {
    let temp = document.createElement("div")
    node.childNodes.forEach((child) => {
      temp.appendChild(child)
    })
    return temp.innerHTML
  }

  private async editDOM(node: ChildNode): Promise<void> {
    // breath first traversal
    let exploreNext: Queue<NodeAndDepth> = new Queue()
    exploreNext.push({'node': node, 'depth': 0})

    while (!exploreNext.isEmpty()) {
      let nodeAndDepth: NodeAndDepth = exploreNext.pop()
      console.log(nodeAndDepth)
      // node's children haven't been accessed yet so editing node's children is fine
      if(nodeAndDepth.node.nodeName == 'MARKDOWN') {
        let asHTML: HTMLElement = nodeAndDepth.node as HTMLElement
        console.log('str', asHTML.innerHTML);
        let compiledMarkdown: string = await marked(this.nodeToString(nodeAndDepth.node));
        asHTML.innerHTML = compiledMarkdown
        console.log('md', compiledMarkdown)
      }
      
      nodeAndDepth.node.childNodes.forEach((node) => {
        if(nodeAndDepth.depth < 10) {
          console.log('child', node)
          exploreNext.push({'node': node, 'depth': nodeAndDepth.depth + 1})
        }
      })
    }
  }

  constructor() {
    let div: HTMLDivElement = document.createElement('div')
    div.innerHTML = this.text
    console.log(div.childNodes)
    console.log(div)
    div.childNodes.forEach((val) => {
      console.log(val.textContent, val.nodeName)
    })

    console.log('test')
    this.editDOM(div).finally(()=> {
      console.log('result', div.innerHTML)
    })
    
  }
}

interface NodeAndDepth {
  node: ChildNode,
  depth: number
}