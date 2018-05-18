$LOAD_PATH << "#{__dir__}/lib"
require 'sdk'
require 'Qt'
require_relative 'src/apis'
require_relative 'src/widget'

module Demo

  class MainFrame < KSO_SDK::View::Frame

    define_button :webview
    define_button :widget

    attr_accessor :web
  
    def initialize(context, app)
      super(nil)
      @app = app
      @context = context
      webview.setText('WebView')
      widget.setText('Widget')
      self.layout = Qt::HBoxLayout.new do |l|
        l.addWidget(webview)
        l.addWidget(widget)
      end
      webview.onClicked = :showWebView
      widget.onClicked = :showWidgets
    end
  
    def showWidgets()
      @app.setContentWidget(DemoFrame.new())
    end
  
    def showWebView()
      self.web = KSO_SDK::View::WebViewWidget.new(@context)
      web.showUrl('https://maimai.cn/activity/wps_entry')
	  # web.showUrl(__dir__ + '\web\index.html')
      web.registerJsApi(Sample.new())
      @app.setContentWidget(web)
    end
  end
  
  class MainApp < KSO_SDK::App
  
    # 插件启动回调
    def onCreate(context)
      setContentWidget(MainFrame.new(context, self))#设置任务窗格显示的控件
    end

  end
  
  KSO_SDK.start(dir:__dir__, page: MainApp)#启动插件
end