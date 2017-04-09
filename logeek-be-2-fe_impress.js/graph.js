let width = 2400
  , height = 7500
  , radius = 15
  , marginLeft = 180
  , marginTop = 30
  , stepW = 90
  , stepH = 75;

// QnD
let stepRange = (ranges, step, start, end) => {
  ranges  = ranges || {};

  for (i = start; i <= end; i++) {
    ranges[i] = step;
  }
};

let stepRangeArr = (ranges, step, arr) => {
  ranges  = ranges || {};

  for (i = 0; i <= arr.length; i++) {
    ranges[arr[i]] = step;
  }
};

// FIXME same as above could work
let stepRangeHashArr = (ranges, step, arr) => {
  ranges  = ranges || {};

  for (i = 0; i <= arr.length; i++) {
    ranges[arr[i]] = step;
  }
};

// TODO by year or hash?


let ranges = {};

stepRange(ranges, 'step-2', 73, 81);
stepRangeArr(ranges, 'step-3', [
  // JAVA
  'e141971', 
  '40ba7d8',
  'b51e4f3',
  '780ecaa'
  ]);

stepRangeArr(ranges, 'step-4', [
  // JS
  '0dc497e', 
  '3242226',
  '3c0e4b0',
  '2b36cb3',
  '60bde1e',
  'ae342d4',
  '7dc64ad',
  '9b5db12'
  ]);

stepRangeArr(ranges, 'step-5', [
  // Java evoution
  '8e33500', 
  '2cdf8cc',
  'c6012a9',
  '078cdbc',
  '92c48ed',
  '25c1fbe',
  '3f2e4f8',
  '37c33b9',
  '61c0f1c',
  '9f9a33b',
  '2a314ba',
  '4ed0293',
  '02ee573'
  ]);

stepRangeArr(ranges, 'step-6', [
  // JS evoution
  '42c5db9', 
  '1d45a89',
  'a9b4ab4',
  '106f27f',
  '61a0040',
  '57fbd48',
  'babe77c',
  'b644e5f',
  '18382a8'
  ]);

stepRangeArr(ranges, 'step-7', [
  // Java modern
  '2669505', 
  '64b3f2b',
  '5015118',
  'e7b2ef0',
  '3950c5b',
  ]);

stepRangeArr(ranges, 'step-8', [
  // Java modern
  'd390b31',
  '2f48b3e',
  'd45be76',
  '9980ca4'
  ]);

stepRangeArr(ranges, 'step-9', [
  // JS modern
  '844417f', 
  '21181e3',
  'f6e374c', 
  '4c0cc5b',
  'c1db024', 
  'f5b27e7',
  '65a2aa9',
  '0b62193',
  '13fe04e',
  '17acf87',
  '0b4fba9',
  '20db55c',
  '12eeeb0',
  '34963cf',
  '76be9c0'
  ]);

stepRangeArr(ranges, 'step-10', [
  '11200c0',
  'c75824c',
  '8a19b42',
  'd858e35',
  'c28ff63',
  '51eb327',
  'ccccfc8',
  '32cdeed',
  'b978fc4',
  '052fe98',
  'dfb4d06',
  'bfe01fa',
  'ad13f0c',
  '6796c19'
  ]);

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

function x1(d) {
    return d.x1;
}
function y1(d) {
    return d.y1;
}
function x2(d) {
    return d.x2;
}
function y2(d) {
    return d.y2;
}

var graphLine = d3.line().x(function(d) {
    return x(d.date);
}).y(function(d) {
    return y(d.close);
});

let background = d3.select("#git-chart").append("div").attr('style', 'position: absolute; z-index: -1').append('div')
  .attr('class', 'label-container');

// background.append('div').text('asdasdasd asd asd asd asd asd asd asd ads asd asd asd asd asd a');
// background.append('div').attr('style', 'background: grey;').text('asdasdasd asd asd asd asd asd asd asd ads asd asd asd asd asd a');
// background.append('div').text('asdasdasd asd asd asd asd asd asd asd ads asd asd asd asd asd a');
let svg = d3.select("#git-chart").append("svg").attr("width", width).attr("height", height);

let gitProcessed = {
    // need to be ordered from most recent tip (then including it's branches)
    // to know the column we need to know the index in the table
    branchTips: [],
    // just a hashmap of commits
    commits: {}
};

d3.json("git.json", function(error, _json) {
    let json = _json.filter(commit=>{
        if (commit.author && commit.author.date) {
            commit.author.date = new Date(commit.author.date);
        }
        if (commit.commiter && commit.commiter.date) {
            commit.commiter.date = new Date(commit.commiter.date);
        }
        return true;
    }
    );
    json = _.sortBy(json, 'commiter.date');

    // start with most recent ones....
    json.reduce((result,current,idx,array)=>{
        // TODO is it index OR timeline position?
        current._idx = array.length - 1 - idx;
        result.commits[current.commit] = current;
        result.commits[current.abbreviated_commit] = current;

        let tags = [];
        let branches = [];
        let head;
        if (current.refs) {
            let refs = current.refs.split(/, */);
            for (ref of refs) {
                tagRef = ref.split(/tag: */);
                if (tagRef.length > 1) {
                    tags.push(tagRef[1]);
                } else {
                    let headRef = ref.split(/HEAD *-> */);
                    if (headRef.length > 1) {
                        head = headRef[1];
                        branches.push(headRef[1]);
                    } else {
                        branches.push(headRef[0]);
                    }
                }
            }
        }

        return gitProcessed;

        // parents = result.branchTips.filter(tip => tip.commit == current.parent);

        // // new branch
        // if (!parents.lenght) {
        //   parent = result.commits[current.parent];
        //   // FIXME need to shift right all between parent as well
        //   // shift all next branches to the right
        //   result.branchTips.filter(tip => tip._branchIdx <= parent._branchIdx || tip._branchIdx++)
        //   current._branchIdx = parent._branchIdx + 1;
        //   result.branchTips.splice(parent._branchIdx, 0, current);
        //   //arr.splice(index, 0, item)
        // }

    }
    , gitProcessed);

    if (error)
        throw error;

    d3.json("git-graph.json", (error, gitGraphData) => {
        for (commit of gitGraphData) {
            gitProcessed.commits[commit.shash].coord = commit;
        }

        for (commit of gitGraphData) {
            if (commit.shash) {
                let parents = ('' + gitProcessed.commits[commit.shash].parent).split(/ /);
                let parent = gitProcessed.commits[parents[0]];

                commit.x1 = marginLeft + commit.col * stepW;
                commit.y1 = marginTop + commit.idx * stepH;
                commit.x2 = marginLeft + commit.col * stepW;
                commit.y2 = marginTop + commit.idx * stepH;
                if (parent) {
                    commit.x2 = marginLeft + parent.coord.col * stepW;
                    commit.y2 = marginTop + parent.coord.idx * stepH;

                    if (parents[1]) {
                        parent = gitProcessed.commits[parents[1]];
                        let merge = {
                            x1: marginLeft + commit.col * stepW,
                            y1: marginTop + commit.idx * stepH,
                            x2: marginLeft + parent.coord.col * stepW,
                            y2: marginTop + parent.coord.idx * stepH
                        };
                        gitGraphData.push(merge);
                    }
                }
            }
        }

        let branchMap = {
          '0': 'branch-mobile',
          '1': 'branch-front-end',
          '2': 'branch-back-end'
        };

        let stepsMap = {

        }

        let link = svg.selectAll("path")
          .data(gitGraphData).enter()
          .append("path")
          .attr("class", d => ['link', branchMap[branchId(d)]].join(' '))
          .attr("d", function(d0) {
            let d = {
                y: d0.x1 || 0,
                x: d0.y1 || 0,
                parent: {
                    y: d0.x2 || 0,
                    x: d0.y2 || 0
                }
            };

            if (d0.shash) {
                return "M" + d.y + "," + d.x + "C" + d.y + "," + (d.x + d.parent.x) / 2 + " " + d.parent.y + "," + (d.x + d.parent.x) / 2 + " " + d.parent.y + "," + d.parent.x;
            } else {
                return "M" + d.y + "," + d.x + "C" + (d.y + 7 * d.parent.y) / 8 + "," + d.x + " " + (7 * d.y + d.parent.y) / 8 + "," + d.parent.x + " " + d.parent.y + "," + d.parent.x;
            }
        });

        let nodes = svg.selectAll("circle").data(gitGraphData.map(d=>({
            x: d.x1,
            y: d.y1,
            col: d.col,
            idx: d.idx,
            shash: d.shash
        })).filter(d=>(d.x || d.y))).enter();

        nodes.append("circle")
          .attr('cx', d=>d.x).attr('cy', d=>d.y)
          .attr('cx', d=>d.x).attr('cy', d=>d.y)
          .attr("r", radius - .75)// .style("fill", function(d) { return fill(d.group); })
          .attr('class', d => branchMap[branchId(d)])
          .style("stroke");

        function branchId(commit) {
          if (['ef3e37d', '6a1baea'].indexOf(commit.shash)+1) {
            return 2;
          }
          return commit.col;
        }

        background.selectAll("div.label").data(gitGraphData.map(d=>({
            x: d.x1,
            y: d.y1,
            col: d.col,
            idx: d.idx,
            shash: d.shash,
            group: d.group
        })).filter(d=>((d.x || d.y) && gitProcessed.commits[d.shash]))).enter().append('div').attr('class', d => {
            let classList = ['label'];
            if (branchId(d)==2) {
              classList.push('even-more');
            } else if (branchId(d)==1) {
              classList.push('even');
            } 
            d.group && classList.push(d.group);
            if (ranges[d.idx]) {
              classList.push('group-' + ranges[d.idx]);
            } else if (ranges[d.shash]) {
              classList.push('group-' + ranges[d.shash]);
            }
            return classList.join(' ');
        })
        .attr('parent', (d)=> d.shash)
        // .data(d => {

        // })
        .attr("y", d=>d.y).attr("x", function(d) {
            return 300;
        }).html(function(d) {
            return gitProcessed.commits[d.shash].subject;
        });
    });

    let rootElement = document.getElementById( "impress" );
    rootElement.addEventListener( "impress:stepleave", function(d) {
      let currentStep = event.target//document.querySelector( ".present" );
      let nextStep = document.querySelector( ".active" );
      console.log( "Step Element '" + currentStep.id + "' => '" + nextStep.id + "'" );

      // TODO znalezc elementy current step == group - oznaczyc wstecz jako current, a poprzednie jako past
      // w drugą stronę => znaleźć poprzedni

    });
});
