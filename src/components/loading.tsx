import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
interface LoadingAnimationProps {
  size?: number;
  showSuccess?: boolean;
  loading?: boolean;
  bgColor?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  loading = false,
  bgColor = "#000d1e",
}) => {
  const [animateLoading, setAnimateLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      setAnimateLoading(true);
    } else {
      setAnimateLoading(false);
    }
  }, [loading]);
  return (
    <div className="relative">
      <svg
        width="913"
        height="913"
        viewBox="0 0 913 913"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="loading">
          <motion.g
            animate={animateLoading ? { rotate: 360 } : {}}
            key={animateLoading ? "loading-outer" : "idle-outer"}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            id="outer"
          >
            <path
              id="Vector"
              d="M406.748 715.358L415.93 668.244L413.966 667.862L404.785 714.975L406.748 715.358ZM381.569 709.257L395.325 663.269L393.409 662.696L379.653 708.684L381.569 709.257ZM357.11 700.716L375.306 656.298L373.456 655.54L355.259 699.958L357.11 700.716ZM333.606 689.817L356.069 647.398L354.301 646.462L331.838 688.881L333.606 689.817ZM311.283 676.67L337.795 636.656L336.128 635.551L309.615 675.565L311.283 676.67ZM290.354 661.397L320.661 624.175L319.11 622.912L288.803 660.134L290.354 661.397ZM271.026 644.146L304.834 610.072L303.414 608.663L269.606 642.738L271.026 644.146ZM253.48 625.083L290.465 594.489L289.19 592.948L252.205 623.542L253.48 625.083ZM237.887 604.393L277.694 577.57L276.576 575.911L236.769 602.734L237.887 604.393ZM224.398 582.274L266.642 559.483L265.692 557.723L223.448 580.514L224.398 582.274ZM213.141 558.938L257.417 540.398L256.644 538.554L212.369 557.093L213.141 558.938ZM204.226 534.612L250.105 520.501L249.517 518.589L203.638 532.7L204.226 534.612ZM197.739 509.529L244.78 499.982L244.382 498.022L197.341 507.569L197.739 509.529ZM193.741 483.932L241.491 479.042L241.287 477.052L193.537 481.943L193.741 483.932ZM192.271 458.067L240.271 457.881L240.263 455.881L192.263 456.067L192.271 458.067ZM193.343 432.181L241.13 436.7L241.319 434.709L193.532 430.19L193.343 432.181ZM196.949 406.525L244.063 415.706L244.446 413.743L197.332 404.562L196.949 406.525ZM203.051 381.345L249.038 395.1L249.611 393.184L203.624 379.429L203.051 381.345ZM211.592 356.886L256.009 375.082L256.768 373.231L212.35 355.035L211.592 356.886ZM222.49 333.38L264.909 355.843L265.844 354.076L223.426 331.613L222.49 333.38ZM235.637 311.058L275.651 337.571L276.755 335.904L236.742 309.391L235.637 311.058ZM250.912 290.13L288.134 320.438L289.396 318.887L252.174 288.579L250.912 290.13ZM268.161 270.803L302.235 304.611L303.644 303.191L269.57 269.383L268.161 270.803ZM287.225 253.257L317.819 290.242L319.36 288.967L288.766 251.982L287.225 253.257ZM307.916 237.664L334.738 277.469L336.396 276.352L309.574 236.546L307.916 237.664ZM330.034 224.174L352.825 266.417L354.585 265.468L331.795 223.224L330.034 224.174ZM353.37 212.918L371.909 257.193L373.754 256.421L355.215 212.145L353.37 212.918ZM377.695 204.003L391.808 249.882L393.719 249.294L379.606 203.415L377.695 204.003ZM402.777 197.515L412.324 244.556L414.284 244.158L404.737 197.117L402.777 197.515ZM428.375 193.518L433.266 241.268L435.255 241.064L430.365 193.315L428.375 193.518ZM454.241 192.048L454.427 240.048L456.427 240.04L456.241 192.04L454.241 192.048ZM480.126 193.121L475.607 240.907L477.599 241.095L482.118 193.309L480.126 193.121ZM505.783 196.725L496.601 243.839L498.565 244.221L507.746 197.108L505.783 196.725ZM530.961 202.828L517.206 248.814L519.122 249.387L532.878 203.401L530.961 202.828ZM555.421 211.368L537.225 255.786L539.075 256.544L557.272 212.126L555.421 211.368ZM578.926 222.265L556.464 264.684L558.231 265.62L580.694 223.201L578.926 222.265ZM601.249 235.414L574.736 275.427L576.403 276.532L602.917 236.519L601.249 235.414ZM622.176 250.687L591.87 287.909L593.421 289.172L623.727 251.95L622.176 250.687ZM641.505 267.938L607.697 302.012L609.117 303.421L642.925 269.346L641.505 267.938ZM659.052 287L622.066 317.595L623.341 319.136L660.327 288.541L659.052 287ZM674.644 307.691L634.838 334.512L635.955 336.171L675.762 309.35L674.644 307.691ZM688.134 329.811L645.89 352.601L646.84 354.362L689.083 331.571L688.134 329.811ZM699.39 353.146L655.114 371.685L655.887 373.53L700.162 354.99L699.39 353.146ZM708.305 377.471L662.426 391.583L663.014 393.495L708.893 379.382L708.305 377.471ZM714.793 402.553L667.752 412.101L668.149 414.061L715.19 404.513L714.793 402.553ZM718.789 428.151L671.04 433.042L671.244 435.031L718.993 430.14L718.789 428.151ZM720.26 454.017L672.26 454.203L672.268 456.203L720.268 456.017L720.26 454.017ZM719.188 479.903L671.401 475.384L671.212 477.375L718.999 481.894L719.188 479.903ZM715.583 505.559L668.469 496.377L668.086 498.34L715.2 507.522L715.583 505.559ZM709.478 530.738L663.492 516.982L662.918 518.899L708.905 532.654L709.478 530.738ZM700.939 555.198L656.522 537.001L655.763 538.852L700.181 557.048L700.939 555.198ZM690.041 578.703L647.623 556.24L646.687 558.008L689.105 580.47L690.041 578.703ZM676.894 601.026L636.88 574.514L635.775 576.181L675.789 602.693L676.894 601.026ZM661.62 621.952L624.397 591.646L623.134 593.197L660.357 623.503L661.62 621.952ZM644.369 641.281L610.294 607.473L608.886 608.893L642.96 642.701L644.369 641.281ZM625.306 658.828L594.712 621.841L593.171 623.116L623.765 660.102L625.306 658.828ZM604.617 674.421L577.796 634.613L576.137 635.731L602.959 675.539L604.617 674.421ZM582.498 687.91L559.706 645.666L557.946 646.616L580.737 688.859L582.498 687.91ZM559.162 699.167L540.623 654.891L538.778 655.663L557.317 699.939L559.162 699.167Z"
              stroke={bgColor}
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              id="Vector_2"
              d="M97.7713 423.142L145.558 427.663L145.746 425.671L97.9596 421.151L97.7713 423.142ZM102.722 388.161L149.836 397.343L150.218 395.38L103.105 386.198L102.722 388.161ZM111.078 353.834L157.065 367.59L157.638 365.674L111.652 351.918L111.078 353.834ZM122.758 320.493L167.175 338.689L167.933 336.838L123.516 318.642L122.758 320.493ZM137.65 288.455L180.069 310.918L181.005 309.15L138.586 286.688L137.65 288.455ZM155.61 258.033L195.623 284.546L196.728 282.879L156.715 256.366L155.61 258.033ZM176.466 229.516L213.688 259.823L214.951 258.272L177.729 227.965L176.466 229.516Z"
              stroke={bgColor}
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              id="Vector_3"
              d="M534.837 708.081L520.725 662.202L518.814 662.79L532.925 708.669L534.837 708.081ZM509.755 714.568L500.207 667.527L498.247 667.925L507.795 714.966L509.755 714.568ZM484.157 718.566L479.266 670.817L477.276 671.021L482.167 718.77L484.157 718.566ZM458.289 720.036L458.104 672.037L456.104 672.044L456.289 720.044L458.289 720.036ZM432.404 718.964L436.923 671.177L434.932 670.989L430.413 718.776L432.404 718.964ZM397.566 762.472L406.748 715.358L404.785 714.976L395.603 762.089L397.566 762.472ZM367.814 755.244L381.569 709.256L379.653 708.683L365.897 754.671L367.814 755.244ZM338.913 745.133L357.109 700.716L355.258 699.958L337.062 744.375L338.913 745.133ZM311.143 732.237L333.606 689.818L331.838 688.882L309.375 731.301L311.143 732.237ZM284.769 716.683L311.281 676.669L309.614 675.565L283.102 715.578L284.769 716.683ZM260.047 698.619L290.354 661.397L288.803 660.134L258.496 697.356L260.047 698.619ZM237.217 678.22L271.025 644.145L269.605 642.737L235.797 676.811L237.217 678.22ZM216.494 655.677L253.479 625.082L252.204 623.541L215.219 654.136L216.494 655.677ZM198.081 631.215L237.888 604.392L236.77 602.734L196.963 629.557L198.081 631.215ZM182.154 605.066L224.398 582.274L223.448 580.514L181.204 603.306L182.154 605.066ZM168.866 577.478L213.142 558.939L212.369 557.094L168.093 575.633L168.866 577.478ZM158.348 548.725L204.226 534.612L203.638 532.7L157.76 546.813L158.348 548.725ZM150.698 519.077L197.739 509.529L197.341 507.569L150.3 517.117L150.698 519.077ZM145.991 488.822L193.741 483.931L193.537 481.942L145.787 486.832L145.991 488.822ZM144.271 458.253L192.271 458.067L192.263 456.067L144.263 456.253L144.271 458.253ZM145.557 427.662L193.345 432.182L193.533 430.191L145.746 425.671L145.557 427.662ZM149.836 397.343L196.949 406.525L197.332 404.562L150.218 395.38L149.836 397.343ZM157.064 367.59L203.052 381.346L203.625 379.43L157.638 365.674L157.064 367.59ZM167.174 338.689L211.592 356.886L212.35 355.035L167.932 336.839L167.174 338.689ZM180.069 310.918L222.489 333.381L223.425 331.614L181.005 309.151L180.069 310.918ZM195.624 284.546L235.637 311.059L236.742 309.392L196.728 282.878L195.624 284.546ZM213.688 259.824L250.91 290.131L252.173 288.58L214.951 258.273L213.688 259.824ZM234.089 236.994L268.163 270.802L269.572 269.382L235.497 235.574L234.089 236.994ZM256.63 216.271L287.226 253.256L288.767 251.981L258.171 214.996L256.63 216.271ZM281.092 197.857L307.915 237.663L309.573 236.545L282.751 196.739L281.092 197.857ZM307.243 181.93L330.033 224.174L331.793 223.224L309.003 180.981L307.243 181.93ZM334.828 168.643L353.368 212.918L355.212 212.146L336.673 167.87L334.828 168.643ZM363.583 158.125L377.696 204.003L379.607 203.415L365.494 157.536L363.583 158.125ZM393.231 150.475L402.778 197.515L404.738 197.118L395.191 150.077L393.231 150.475ZM423.485 145.767L428.375 193.517L430.365 193.313L425.474 145.564L423.485 145.767ZM454.054 144.048L454.24 192.048L456.24 192.04L456.054 144.04L454.054 144.048ZM484.646 145.334L480.127 193.12L482.118 193.308L486.637 145.522L484.646 145.334ZM514.964 149.612L505.783 196.725L507.746 197.108L516.928 149.994L514.964 149.612ZM544.717 156.841L530.961 202.827L532.878 203.4L546.633 157.414L544.717 156.841ZM573.618 166.951L555.422 211.369L557.272 212.127L575.469 167.709L573.618 166.951ZM601.389 179.846L578.926 222.265L580.694 223.201L603.156 180.782L601.389 179.846ZM627.762 195.399L601.249 235.413L602.916 236.518L629.429 196.504L627.762 195.399ZM652.484 213.465L622.177 250.687L623.728 251.95L654.035 214.728L652.484 213.465ZM675.315 233.865L641.507 267.939L642.926 269.348L676.734 235.274L675.315 233.865ZM696.038 256.406L659.052 287L660.327 288.542L697.313 257.947L696.038 256.406ZM714.451 280.869L674.644 307.69L675.762 309.349L715.568 282.528L714.451 280.869ZM730.377 307.02L688.134 329.81L689.083 331.57L731.327 308.78L730.377 307.02Z"
              stroke={bgColor}
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              id="Vector_4"
              d="M200.016 203.184L234.09 236.992L235.499 235.572L201.425 201.765L201.427 201.764L167.354 167.956L165.945 169.376L200.017 203.183L200.016 203.184ZM226.035 179.284L256.63 216.269L258.171 214.995L227.576 178.009L226.035 179.284ZM254.27 158.05L281.092 197.856L282.75 196.738L255.928 156.932L254.27 158.05ZM284.452 139.685L307.242 181.929L309.002 180.979L286.212 138.736L284.452 139.685ZM316.288 124.368L334.827 168.643L336.672 167.871L318.133 123.595L316.288 124.368ZM349.471 112.246L363.584 158.125L365.496 157.537L351.383 111.658L349.471 112.246ZM383.684 103.433L393.231 150.474L395.191 150.076L385.644 103.035L383.684 103.433ZM418.594 98.0171L423.485 145.766L425.475 145.562L420.584 97.8133L418.594 98.0171ZM453.868 96.0478L454.054 144.048L456.054 144.04L455.868 96.0401L453.868 96.0478ZM489.165 97.5471L484.646 145.333L486.637 145.521L491.156 97.7354L489.165 97.5471ZM524.146 102.498L514.965 149.611L516.928 149.994L526.109 102.88L524.146 102.498ZM558.472 110.854L544.717 156.84L546.633 157.413L560.388 111.427L558.472 110.854ZM591.814 122.533L573.618 166.951L575.469 167.709L593.665 123.292L591.814 122.533ZM623.851 137.426L601.388 179.845L603.156 180.781L625.619 138.362L623.851 137.426ZM654.274 155.386L627.761 195.399L629.428 196.504L655.942 156.491L654.274 155.386ZM682.789 176.243L652.483 213.465L654.034 214.728L684.34 177.505L682.789 176.243ZM709.123 199.793L675.315 233.867L676.735 235.276L710.543 201.201L709.123 199.793ZM733.024 225.811L696.038 256.405L697.313 257.946L734.299 227.352L733.024 225.811ZM754.258 254.047L714.452 280.868L715.569 282.527L755.376 255.706L754.258 254.047ZM772.622 284.228L730.379 307.019L731.328 308.779L773.572 285.989L772.622 284.228ZM787.939 316.064L743.663 334.603L744.436 336.448L788.712 317.909L787.939 316.064ZM800.063 349.247L754.184 363.36L754.772 365.271L800.651 351.159L800.063 349.247ZM808.874 383.458L761.833 393.006L762.231 394.966L809.272 385.418L808.874 383.458ZM814.29 418.371L766.541 423.262L766.745 425.251L814.494 420.36L814.29 418.371ZM816.26 453.645L768.26 453.831L768.267 455.831L816.267 455.645L816.26 453.645ZM814.76 488.941L766.973 484.422L766.785 486.414L814.572 490.932L814.76 488.941ZM809.81 523.922L762.696 514.74L762.314 516.703L809.427 525.885L809.81 523.922ZM801.453 558.248L755.466 544.492L754.893 546.408L800.88 560.164L801.453 558.248ZM789.773 591.591L745.356 573.395L744.597 575.245L789.015 593.442L789.773 591.591ZM774.881 623.628L732.463 601.165L731.527 602.932L773.945 625.395L774.881 623.628ZM756.922 654.051L716.908 627.538L715.804 629.205L755.817 655.718L756.922 654.051ZM736.065 682.566L698.842 652.259L697.58 653.81L734.802 684.117L736.065 682.566ZM712.514 708.9L678.439 675.092L677.031 676.512L711.105 710.32L712.514 708.9ZM686.496 732.8L655.901 695.814L654.36 697.089L684.954 734.075L686.496 732.8ZM658.261 754.034L631.439 714.227L629.781 715.344L656.603 755.152L658.261 754.034ZM628.079 772.398L605.288 730.154L603.528 731.104L626.319 773.347L628.079 772.398ZM596.244 787.716L577.705 743.44L575.86 744.212L594.399 788.488L596.244 787.716ZM563.06 799.837L548.948 753.959L547.036 754.547L561.148 800.425L563.06 799.837ZM528.848 808.651L519.3 761.61L517.34 762.007L526.888 809.048L528.848 808.651ZM493.937 814.066L489.046 766.317L487.056 766.521L491.947 814.27L493.937 814.066ZM458.662 816.035L458.477 768.035L456.477 768.043L456.662 816.043L458.662 816.035ZM423.365 814.538L427.884 766.751L425.893 766.562L421.373 814.349L423.365 814.538ZM379.203 856.699L388.385 809.585L386.422 809.203L377.24 856.316L379.203 856.699ZM340.304 847.217L354.059 801.23L352.143 800.657L338.388 846.644L340.304 847.217ZM302.52 833.968L320.716 789.551L318.866 788.793L300.669 833.21L302.52 833.968ZM266.218 817.077L288.681 774.658L286.913 773.722L264.45 816.141L266.218 817.077ZM231.745 796.711L258.257 756.697L256.59 755.593L230.078 795.606L231.745 796.711ZM199.434 773.064L229.741 735.842L228.19 734.58L197.883 771.802L199.434 773.064ZM169.598 746.365L203.406 712.29L201.987 710.882L168.179 744.956L169.598 746.365ZM142.521 716.867L179.506 686.273L178.232 684.732L141.247 715.326L142.521 716.867ZM118.466 684.859L158.273 658.036L157.155 656.377L117.348 683.2L118.466 684.859ZM97.6652 650.647L139.91 627.856L138.96 626.096L96.7156 648.887L97.6652 650.647ZM80.3179 614.56L124.593 596.02L123.82 594.176L79.5454 612.715L80.3179 614.56ZM66.5909 576.947L112.469 562.836L111.881 560.925L66.0029 575.035L66.5909 576.947ZM56.6162 538.171L103.657 528.623L103.259 526.663L56.2184 536.211L56.6162 538.171ZM50.4906 498.602L98.2408 493.711L98.037 491.722L50.2868 496.612L50.4906 498.602ZM48.2721 458.626L96.2719 458.44L96.2642 456.44L48.2643 456.626L48.2721 458.626ZM49.9835 418.623L97.7704 423.142L97.9587 421.151L50.1718 416.632L49.9835 418.623ZM55.6084 378.98L102.722 388.161L103.105 386.198L55.9909 377.017L55.6084 378.98ZM65.0904 340.08L111.077 353.836L111.65 351.92L65.6635 338.163L65.0904 340.08ZM78.3403 302.296L122.758 320.492L123.516 318.642L79.0985 300.445L78.3403 302.296ZM95.2302 265.993L137.65 288.455L138.586 286.688L96.1661 264.225L95.2302 265.993ZM115.597 231.521L155.61 258.034L156.715 256.367L116.701 229.853L115.597 231.521ZM139.244 199.209L176.466 229.517L177.729 227.966L140.507 197.659L139.244 199.209ZM195.44 142.298L226.034 179.283L227.575 178.008L196.981 141.023L195.44 142.298Z"
              stroke={bgColor}
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              id="Vector_5"
              d="M743.665 334.605L699.389 353.144L700.162 354.989L744.437 336.45L743.665 334.605ZM754.183 363.358L708.305 377.471L708.893 379.383L754.771 365.27L754.183 363.358ZM761.833 393.005L714.792 402.553L715.19 404.513L762.231 394.965L761.833 393.005ZM766.539 423.26L718.79 428.151L718.994 430.14L766.743 425.25L766.539 423.26ZM768.26 453.831L720.26 454.016L720.267 456.016L768.267 455.831L768.26 453.831ZM766.975 484.421L719.187 479.903L718.999 481.894L766.786 486.412L766.975 484.421ZM762.696 514.74L715.582 505.558L715.2 507.521L762.314 516.703L762.696 514.74ZM755.465 544.493L709.478 530.738L708.905 532.654L754.892 546.409L755.465 544.493ZM745.357 573.393L700.939 555.197L700.181 557.048L744.598 575.244L745.357 573.393ZM732.462 601.164L690.043 578.702L689.107 580.469L731.526 602.932L732.462 601.164ZM716.908 627.538L676.895 601.025L675.79 602.692L715.803 629.206L716.908 627.538ZM698.841 652.26L661.619 621.952L660.356 623.503L697.578 653.811L698.841 652.26ZM678.442 675.091L644.367 641.283L642.959 642.703L677.033 676.511L678.442 675.091ZM655.9 695.813L625.307 658.826L623.765 660.101L654.359 697.088L655.9 695.813ZM631.438 714.226L604.616 674.419L602.958 675.537L629.78 715.344L631.438 714.226ZM605.288 730.154L582.496 687.91L580.736 688.86L603.528 731.103L605.288 730.154ZM577.703 743.44L559.164 699.165L557.319 699.937L575.858 744.213L577.703 743.44ZM548.948 753.958L534.836 708.08L532.924 708.668L547.036 754.546L548.948 753.958ZM519.302 761.61L509.754 714.569L507.794 714.966L517.342 762.008L519.302 761.61ZM489.046 766.316L484.155 718.566L482.166 718.77L487.057 766.519L489.046 766.316ZM458.477 768.035L458.291 720.035L456.291 720.043L456.477 768.043L458.477 768.035ZM427.884 766.751L432.403 718.963L430.412 718.774L425.893 766.562L427.884 766.751ZM388.385 809.585L397.566 762.471L395.603 762.089L386.422 809.202L388.385 809.585ZM354.058 801.231L367.814 755.243L365.898 754.67L352.142 800.658L354.058 801.231ZM320.716 789.55L338.913 745.133L337.062 744.375L318.866 788.792L320.716 789.55ZM288.68 774.656L311.143 732.237L309.375 731.301L286.913 773.72L288.68 774.656ZM258.258 756.696L284.77 716.683L283.103 715.578L256.59 755.591L258.258 756.696ZM229.74 735.841L260.048 698.619L258.497 697.356L228.189 734.578L229.74 735.841ZM203.407 712.291L237.215 678.217L235.796 676.808L201.988 710.882L203.407 712.291ZM179.508 686.272L216.493 655.678L215.218 654.137L178.233 684.731L179.508 686.272ZM158.273 658.037L198.08 631.215L196.962 629.556L157.156 656.378L158.273 658.037ZM139.91 627.855L182.153 605.065L181.204 603.305L138.96 626.095L139.91 627.855ZM124.592 596.019L168.868 577.48L168.095 575.635L123.819 594.174L124.592 596.019ZM112.469 562.835L158.348 548.723L157.76 546.812L111.881 560.923L112.469 562.835ZM103.657 528.624L150.698 519.075L150.3 517.115L103.259 526.663L103.657 528.624ZM98.2406 493.712L145.991 488.821L145.787 486.832L98.0368 491.722L98.2406 493.712ZM96.2719 458.44L144.272 458.254L144.264 456.254L96.2642 456.44L96.2719 458.44ZM227.448 118.243L254.27 158.049L255.928 156.931L229.106 117.126L227.448 118.243ZM261.66 97.4417L284.451 139.685L286.211 138.736L263.421 96.4921L261.66 97.4417ZM297.748 80.0934L316.287 124.369L318.132 123.597L299.592 79.3209L297.748 80.0934ZM335.36 66.3663L349.472 112.245L351.384 111.657L337.271 65.7782L335.36 66.3663ZM374.136 56.3916L383.683 103.432L385.643 103.035L376.096 55.9938L374.136 56.3916ZM413.705 50.2669L418.595 98.0161L420.585 97.8123L415.694 50.0631L413.705 50.2669ZM453.682 48.0488L453.868 96.0487L455.868 96.0409L455.682 48.041L453.682 48.0488ZM493.685 49.7602L489.166 97.5461L491.157 97.7344L495.676 49.9485L493.685 49.7602ZM533.328 55.3839L524.146 102.498L526.109 102.88L535.291 55.7665L533.328 55.3839ZM572.227 64.8667L558.471 110.853L560.388 111.426L574.143 65.4399L572.227 64.8667ZM610.01 78.1167L591.814 122.534L593.665 123.292L611.861 78.8748L610.01 78.1167ZM646.314 95.0065L623.851 137.425L625.619 138.361L648.081 95.9425L646.314 95.0065ZM680.787 115.372L654.273 155.386L655.941 156.49L682.454 116.477L680.787 115.372ZM713.096 139.02L682.789 176.243L684.34 177.505L714.647 140.283L713.096 139.02ZM742.932 165.719L709.124 199.794L710.544 201.202L744.352 167.128L742.932 165.719ZM770.009 195.217L733.023 225.811L734.298 227.352L771.284 196.758L770.009 195.217ZM794.064 227.225L754.257 254.046L755.375 255.705L795.181 228.884L794.064 227.225ZM814.866 261.437L772.622 284.227L773.572 285.988L815.815 263.197L814.866 261.437ZM832.214 297.523L787.938 316.062L788.711 317.907L832.986 299.368L832.214 297.523ZM845.941 335.135L800.062 349.248L800.65 351.16L846.529 337.047L845.941 335.135ZM855.915 373.911L808.874 383.459L809.272 385.419L856.313 375.871L855.915 373.911ZM862.041 413.48L814.291 418.371L814.495 420.36L862.244 415.47L862.041 413.48ZM864.259 453.458L816.259 453.644L816.266 455.644L864.266 455.458L864.259 453.458ZM862.547 493.461L814.76 488.942L814.572 490.934L862.359 495.452L862.547 493.461ZM856.923 533.103L809.81 523.922L809.427 525.885L856.541 535.066L856.923 533.103ZM847.439 572.003L801.452 558.249L800.879 560.165L846.866 573.919L847.439 572.003ZM834.191 609.787L789.773 591.591L789.015 593.441L833.432 611.638L834.191 609.787ZM817.301 646.091L774.882 623.628L773.946 625.395L816.365 647.858L817.301 646.091ZM796.935 680.562L756.922 654.049L755.817 655.716L795.831 682.229L796.935 680.562ZM773.287 712.873L736.064 682.567L734.802 684.118L772.024 714.423L773.287 712.873ZM746.587 742.709L712.513 708.901L711.104 710.32L745.178 744.128L746.587 742.709ZM717.09 769.786L686.496 732.8L684.954 734.075L715.549 771.061L717.09 769.786ZM685.082 793.839L658.26 754.033L656.602 755.15L683.424 794.957L685.082 793.839ZM650.871 814.641L628.079 772.397L626.319 773.347L649.11 815.591L650.871 814.641ZM614.784 831.99L596.245 787.714L594.4 788.486L612.939 832.762L614.784 831.99ZM577.172 845.717L563.061 799.838L561.149 800.426L575.261 846.305L577.172 845.717ZM538.395 855.691L528.847 808.65L526.887 809.048L536.435 856.089L538.395 855.691ZM498.827 861.816L493.937 814.066L491.947 814.27L496.838 862.02L498.827 861.816ZM458.848 864.035L458.662 816.035L456.662 816.043L456.848 864.043L458.848 864.035ZM418.846 862.325L423.366 814.537L421.375 814.349L416.855 862.136L418.846 862.325ZM370.022 903.813L379.203 856.699L377.24 856.316L368.059 903.43L370.022 903.813ZM326.548 893.204L340.304 847.217L338.388 846.644L324.632 892.631L326.548 893.204ZM284.323 878.384L302.519 833.967L300.669 833.209L282.472 877.626L284.323 878.384ZM243.755 859.496L266.218 817.077L264.45 816.141L241.988 858.56L243.755 859.496ZM205.234 836.724L231.746 796.711L230.079 795.606L203.566 835.62L205.234 836.724ZM169.127 810.286L199.435 773.064L197.884 771.802L167.576 809.024L169.127 810.286ZM135.79 780.437L169.598 746.363L168.178 744.954L134.37 779.028L135.79 780.437ZM105.536 747.461L142.521 716.867L141.246 715.326L104.261 745.92L105.536 747.461ZM78.6592 711.681L118.467 684.859L117.349 683.2L77.5417 710.022L78.6592 711.681ZM55.4214 673.439L97.6652 650.647L96.7155 648.887L54.4717 671.679L55.4214 673.439ZM36.0429 633.1L80.3177 614.561L79.5452 612.716L35.2704 631.255L36.0429 633.1ZM20.7122 591.06L66.5907 576.948L66.0027 575.036L20.1242 589.148L20.7122 591.06Z"
              stroke={bgColor}
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              id="Vector_6"
              d="M9.57456 547.717L56.6154 538.17L56.2176 536.21L9.17675 545.757L9.57456 547.717ZM2.74041 503.492L50.4916 498.602L50.2878 496.612L2.53665 501.503L2.74041 503.492ZM0.272184 458.812L48.2721 458.626L48.2643 456.626L0.264437 456.812L0.272184 458.812ZM2.19669 414.103L49.9844 418.623L50.1728 416.632L2.38503 412.112L2.19669 414.103ZM8.49467 369.798L55.6083 378.98L55.9909 377.017L8.87723 367.835L8.49467 369.798ZM19.1034 326.324L65.0911 340.081L65.6643 338.165L19.6766 324.408L19.1034 326.324ZM33.9228 284.1L78.3403 302.296L79.0985 300.445L34.681 282.249L33.9228 284.1ZM52.8095 243.53L95.23 265.993L96.1659 264.226L53.7454 241.763L52.8095 243.53ZM75.582 205.009L115.595 231.522L116.7 229.855L76.6868 203.342L75.582 205.009ZM102.022 168.903L139.244 199.21L140.507 197.659L103.285 167.352L102.022 168.903ZM131.872 135.566L165.945 169.373L167.354 167.954L133.281 134.146L131.872 135.566ZM164.846 105.312L195.441 142.297L196.982 141.022L166.387 104.037L164.846 105.312ZM200.626 78.4367L227.449 118.243L229.107 117.125L202.284 77.3191L200.626 78.4367ZM238.87 55.1974L261.661 97.4408L263.421 96.4912L240.63 54.2477L238.87 55.1974ZM279.206 35.8183L297.746 80.0941L299.59 79.3216L281.051 35.0458L279.206 35.8183ZM321.248 20.4879L335.361 66.3665L337.272 65.7785L323.159 19.8998L321.248 20.4879ZM364.589 9.35098L374.137 56.3918L376.097 55.994L366.549 8.95318L364.589 9.35098ZM408.814 2.51684L413.705 50.266L415.694 50.0623L410.804 2.31306L408.814 2.51684ZM453.495 0.048795L453.681 48.0487L455.681 48.0409L455.495 0.0410487L453.495 0.048795ZM498.204 1.97332L493.685 49.7593L495.676 49.9476L500.196 2.16162L498.204 1.97332ZM542.509 8.2703L533.328 55.384L535.291 55.7666L544.472 8.65286L542.509 8.2703ZM585.982 18.8798L572.227 64.8658L574.143 65.4389L587.898 19.453L585.982 18.8798ZM628.208 33.6994L610.011 78.1169L611.862 78.8751L630.058 34.4576L628.208 33.6994ZM668.777 52.5871L646.314 95.0056L648.082 95.9416L670.544 53.5231L668.777 52.5871ZM707.298 75.3586L680.785 115.372L682.452 116.477L708.966 76.4633L707.298 75.3586ZM743.404 101.797L713.097 139.02L714.648 140.282L744.955 103.06L743.404 101.797ZM776.742 131.648L742.934 165.722L744.354 167.13L778.162 133.056L776.742 131.648ZM806.996 164.622L770.01 195.216L771.284 196.757L808.271 166.163L806.996 164.622ZM833.871 200.403L794.065 227.224L795.183 228.883L834.989 202.062L833.871 200.403ZM857.109 238.646L814.866 261.436L815.815 263.196L858.059 240.406L857.109 238.646ZM876.488 278.983L832.212 297.522L832.985 299.367L877.261 280.828L876.488 278.983ZM891.82 321.023L845.941 335.136L846.529 337.048L892.408 322.935L891.82 321.023ZM902.957 364.365L855.916 373.913L856.313 375.873L903.354 366.325L902.957 364.365ZM909.791 408.59L862.041 413.48L862.245 415.47L909.994 410.579L909.791 408.59ZM912.259 453.272L864.259 453.458L864.266 455.458L912.266 455.272L912.259 453.272ZM910.334 497.98L862.547 493.462L862.359 495.453L910.146 499.971L910.334 497.98ZM904.037 542.285L856.924 533.103L856.541 535.066L903.655 544.248L904.037 542.285ZM893.428 585.758L847.44 572.003L846.867 573.92L892.855 587.674L893.428 585.758ZM878.608 627.983L834.191 609.787L833.432 611.638L877.85 629.834L878.608 627.983ZM859.72 668.552L817.302 646.09L816.366 647.857L858.784 670.32L859.72 668.552ZM836.949 707.075L796.935 680.562L795.831 682.23L835.844 708.742L836.949 707.075ZM810.509 743.18L773.287 712.872L772.024 714.423L809.246 744.731L810.509 743.18ZM780.66 776.518L746.586 742.71L745.177 744.13L779.251 777.938L780.66 776.518ZM747.685 806.771L717.091 769.785L715.55 771.06L746.144 808.046L747.685 806.771ZM711.906 833.648L685.084 793.841L683.425 794.958L710.247 834.766L711.906 833.648ZM673.662 856.886L650.87 814.642L649.11 815.592L671.902 857.835L673.662 856.886ZM633.326 876.265L614.786 831.989L612.942 832.762L631.481 877.037L633.326 876.265ZM591.283 891.595L577.171 845.717L575.26 846.305L589.372 892.183L591.283 891.595ZM547.943 902.732L538.394 855.691L536.434 856.089L545.983 903.13L547.943 902.732ZM503.717 909.566L498.826 861.816L496.837 862.02L501.727 909.77L503.717 909.566ZM459.035 912.035L458.849 864.035L456.849 864.043L457.035 912.043L459.035 912.035ZM414.327 910.111L418.846 862.324L416.855 862.135L412.336 909.922L414.327 910.111Z"
              stroke={bgColor}
              strokeWidth="2"
              strokeMiterlimit="10"
            />
          </motion.g>
          <motion.path
            animate={animateLoading ? { rotate: -360 } : {}}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            key={animateLoading ? "loading-inner" : "idle-inner"}
            id="inner"
            d="M469.268 522.683L496.813 664.024M455.997 523.939L455.439 667.939M442.738 522.581L423.642 616.662M411.457 562.937L429.996 518.661M391.441 552.138L418.263 512.332M373.918 537.644L407.993 503.836M359.562 520.009L399.575 493.497M393.338 481.719L260.086 536.308M389.518 468.946L248.177 496.491M340.262 455.489L388.262 455.675M342.579 432.867L389.62 442.416M349.265 411.133L393.541 429.672M360.062 391.119L399.868 417.94M374.557 373.596L408.365 407.671M418.703 399.253L365.679 319.226M430.483 393.015L394.09 304.18M443.255 389.194L415.71 247.854M456.526 387.94L456.898 291.94M469.785 389.298L488.881 295.216M501.068 348.941L482.529 393.217M521.082 359.74L494.26 399.545M538.605 374.233L504.53 408.041M552.962 391.867L512.948 418.38M519.186 430.16L608.021 393.767M523.006 442.932L664.348 415.387M572.261 456.389L524.261 456.203M569.945 479.011L522.904 469.463M563.259 500.746L518.983 482.207M552.461 520.76L512.655 493.938M537.967 538.281L504.159 504.207M520.334 552.638L493.821 512.625M500.237 563.281L482.041 518.864M392.915 607.211L411.454 562.936M391.442 552.139L337.798 631.752M339.846 571.453L373.921 537.645M319.548 546.523L359.561 520.01M340.263 455.488L244.263 455.116M342.579 432.869L248.497 413.773M304.99 392.593L349.266 411.132M360.061 391.118L280.448 337.476M340.748 339.524L374.556 373.598M519.608 304.667L501.069 348.943M547.905 319.933L521.083 359.738M572.677 340.425L538.603 374.233M592.975 365.354L552.962 391.868M572.26 456.39L668.26 456.762M616.986 488.559L569.945 479.01M607.533 519.286L563.257 500.747M592.269 547.581L552.462 520.758M571.776 572.355L537.968 538.28M546.846 592.652L520.332 552.639M500.237 563.28L536.63 652.115M414.097 663.703L423.644 616.662M374.375 651.486L392.914 607.21M305.773 605.262L339.848 571.454M279.534 573.035L319.548 546.521M260.716 374.052L304.992 392.592M306.938 305.451L340.746 339.526M339.165 279.212L365.678 319.226M375.893 259.763L394.089 304.18M457.085 243.94L456.899 291.94M498.428 248.174L488.88 295.215M538.149 260.393L519.61 304.668M574.726 280.126L547.904 319.932M606.75 306.616L572.676 340.424M632.989 338.843L592.976 365.356M652.437 375.571L608.02 393.767M664.027 498.105L616.986 488.557M651.807 537.826L607.532 519.287M632.075 574.403L592.268 547.581M605.586 606.426L571.778 572.352M573.358 632.667L546.845 592.653"
            stroke={bgColor}
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </g>
      </svg>
    </div>
  );
};

export default LoadingAnimation;
